"use client"

//EXTERNAL LIBRARIES
import { useContext, useState } from "react";
import { ChangeEvent, FormEvent } from "react";

//TYPES
import { UserDTO } from "@/app/@types/UserDTO";

//UI COMPONENTS
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

//CONTEXT
import { AuthContext } from "@/app/context/AuthContext";

export const FormAuth = () => {
  const [username, setUsername] = useState<string>("");
  const [photo, setPhoto] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  
  const { signIn } = useContext(AuthContext);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if(username && photo) {
      const dto: UserDTO = {
        username,
        photo,
      };

      setTimeout(() => {}, 2000);
      signIn(dto);
    }

    setTimeout(() => setLoading(false), 2000);
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setUsername(value);
  }

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if(files && files[0]) {
      const file = files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  }

  return (
    <form onSubmit={submit}>
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Join Chat</FieldLegend>
          <FieldDescription>
            Enter your username to join the chat!
          </FieldDescription>
          <FieldSeparator />
          <FieldGroup>
            <Field>
              <FieldLabel>Username *</FieldLabel>
              <Input
                required
                type="text"
                value={username}
                onChange={handleChange}
                placeholder="Enter your username"
                maxLength={20}
                onError={(error) => error}
              />
              <FieldDescription className="text-xs">
                Max 20 characters
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel>Profile Image *</FieldLabel>
              <Input
                required
                type="file"
                onChange={handleChangeImage}
                placeholder="Enter your profile image"
                accept="image/*"
              />
              <FieldDescription className="text-xs">
                Valid Formats (.jpg, .jpeg, .png)
              </FieldDescription>
            </Field>
            <Field>
              <Button disabled={!username.trim() || !photo || loading}>
                {loading ? "Connecting" : "Join"}
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </FieldGroup>
    </form>
  );
}