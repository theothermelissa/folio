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
import { useState } from "react";

const shouldBeUnique = (key: string) => {
  switch (key) {
    case "email":
    case "subdomain":
    case "phone":
      return true;
    default:
      return false;
  }
};

const updateAccountValue = async (key: string, value: string) => {
  console.log("updating ", key, " value to ", value);

  const result = await fetch(`/api/account/${key}`, {
    method: "PUT",
    body: `{ "${key}": "${value}", "shouldBeUnique": "${shouldBeUnique(
      key
    )}" }`,
  });
  console.log("result of update call is ", result);
  return { isFinishedEditing: result.status === 200 };
};

const EditAccountValue = ({ key, currentValue }) => {
  const [value, setValue] = useState(currentValue);
  const [editing, setEditing] = useState(false);

  const onEditClick = () => {
    setEditing(true);
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setValue(value);
    console.log("new value for ", key, " should change to ", value);
    updateAccountValue(key, value).then(({ isFinishedEditing }) => {
      console.log("isFinishedEditing is ", isFinishedEditing);
      setEditing(!isFinishedEditing);
    });
  };
};

export const EditAccountName = ({ id, currentName }) => {
  const [name, setName] = useState(currentName);
  const [isEditing, setIsEditing] = useState(false);

  const onNameEditClick = () => {
    setIsEditing(true);
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setName(name);
    console.log("new name for user ", id, " should change to ", name);
    onChangeName().then(({ isFinishedEditing }) => {
      console.log("isFinishedEditing is ", isFinishedEditing);
      setIsEditing(!isFinishedEditing);
    });
  };

  const onChangeName = async () => {
    console.log("updating name to ", name);
    const result = await fetch(`/api/account/${id}`, {
      method: "PUT",
      body: name,
    });
    console.log("result of update call is ", result);
    return { isFinishedEditing: result.status === 200 };
  };

  return (
    <Box minHeight="500px">
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              placeholder={currentName}
              onChange={(e: React.FormEvent<HTMLInputElement>) =>
                setName(e.currentTarget.value)
              }
            />
            <FormHelperText>The question is, 🦉 whooo are YOU?</FormHelperText>
          </FormControl>
          <Button type="submit">Submit</Button>
        </form>
      ) : (
        <Text fontSize="md">
          {name}{" "}
          <IconButton
            aria-label="edit"
            variant="ghost"
            color="dimgrey"
            icon={<EditIcon />}
            onClick={onNameEditClick}
          />
        </Text>
      )}
    </Box>
  );
};
