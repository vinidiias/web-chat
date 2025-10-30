import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface FormJoinProps {
  isConnected: boolean;
  username: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleJoin: (e: React.FormEvent) => void;
}

export const FormJoin = ({
  isConnected,
  username,
  handleChange,
  handleJoin,
}: FormJoinProps) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 rounded-lg shadow-md">
        <form onSubmit={handleJoin}>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Join Chat</FieldLegend>
              <FieldDescription>
                Enter your username to join the chat!
              </FieldDescription>
              <FieldGroup>
                <Field>
                  <FieldLabel>Username</FieldLabel>
                  <Input
                    type="text"
                    value={username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    maxLength={20}
                  />
                  <FieldDescription>Max 20 characters</FieldDescription>
                </Field>
                <Field>
                  <Button disabled={!username.trim() || !isConnected}>
                    {isConnected ? "Join" : "Connecting..."}
                  </Button>
                </Field>
              </FieldGroup>
            </FieldSet>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
};