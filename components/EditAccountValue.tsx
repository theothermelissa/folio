import { EditIcon } from "@chakra-ui/icons";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Button,
  Box,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

const shouldBeUnique = (keyToUpdate: string) => {
  switch (keyToUpdate) {
    case "email":
    case "subdomain":
    case "phone":
      return true;
    default:
      return false;
  }
};

const updateUserRecord = async (
  userId: number,
  keyToUpdate: string,
  value: string
) => {
  // console.log("updating ", keyToUpdate, " value to ", value);

  const result = await fetch(`/api/account/${userId}`, {
    method: "PUT",
    body: JSON.stringify({
      keyToUpdate,
      updatedValue: value,
      shouldBeUnique: shouldBeUnique(keyToUpdate),
    }),
  });
  // console.log("result of update call is ", result);
  return { isFinishedEditing: result.status === 200 };
};

export function EditAccountValue({ userId, keyToUpdate, currentValue }) {
  const [value, setValue] = useState(currentValue);
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef != null) {
      inputRef.current.focus();
    }
  }, [editing, inputRef]);

  const onEditClick = () => {
    setEditing(true);
  };

  const handleBlur = () => {
    setValue(currentValue);
    setEditing(false);
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setEditing(false);
    // console.log("new value for ", keyToUpdate, " should change to ", tempValue);
    updateUserRecord(userId, keyToUpdate, value).then(
      ({ isFinishedEditing }) => {
        // console.log("isFinishedEditing is ", isFinishedEditing);
        setEditing(!isFinishedEditing);
      }
    );
  };

  return (
    <Box>
      {editing ? (
        <form onSubmit={handleSubmit}>
          <FormControl>
            {/* <FormLabel>Name</FormLabel> */}
            <Input
              type="text"
              // placeholder={value}
              onBlur={handleBlur}
              ref={inputRef}
              value={value}
              onChange={(e: React.FormEvent<HTMLInputElement>) =>
                setValue(e.currentTarget.value)
              }
            />
            {/* <FormHelperText>The question is, 🦉 whooo are YOU?</FormHelperText> */}
          </FormControl>
          <Button type="submit">Submit</Button>
        </form>
      ) : (
        <Text fontSize="md">
          {value}{" "}
          <IconButton
            aria-label="edit"
            variant="ghost"
            color="dimgrey"
            icon={<EditIcon />}
            onClick={onEditClick}
          />
        </Text>
      )}
    </Box>
  );
}
