import { ErrorProps } from "../types";

export const Error = ({ error }: ErrorProps) => {
  if (!error || !error.message) return null;
    return <div>Error: {error.message}</div>;
};