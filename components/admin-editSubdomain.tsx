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

export const EditAccountSubdomain = ({ id, currentSubdomain }) => {
  const [desiredSubdomain, setDesiredSubdomain] = useState(currentSubdomain);
  const [isEditing, setIsEditing] = useState(false);

  const onSubdomainEditClick = () => {
    setIsEditing(true);
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setDesiredSubdomain(desiredSubdomain);
    // console.log(
    //   "new Subdomain for user ",
    //   id,
    //   " should change to ",
    //   desiredSubdomain
    // );
    onChangeSubdomain().then(({ isFinishedEditing }) => {
      // console.log("isFinishedEditing is ", isFinishedEditing);
      setIsEditing(!isFinishedEditing);
    });
  };

  const onChangeSubdomain = async () => {
    // console.log("updating Subdomain to ", desiredSubdomain);
    const result = await fetch(`/api/account/${id}`, {
      method: "PUT",
      body: desiredSubdomain,
    });
    // console.log("result of update call is ", result);
    return { isFinishedEditing: result.status === 200 };
  };

  return (
    <Box minHeight="500px">
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel>Subdomain Name</FormLabel>
            <Input
              type="text"
              placeholder={currentSubdomain}
              onChange={(e: React.FormEvent<HTMLInputElement>) =>
                setDesiredSubdomain(e.currentTarget.value)
              }
            />
            <FormHelperText>
              What would you like to name your channel?
            </FormHelperText>
          </FormControl>
          <Button type="submit">Submit</Button>
        </form>
      ) : (
        <Text fontSize="md">
          {desiredSubdomain}{" "}
          <IconButton
            aria-label="edit"
            variant="ghost"
            color="dimgrey"
            icon={<EditIcon />}
            onClick={onSubdomainEditClick}
          />
        </Text>
      )}
    </Box>
  );
};
