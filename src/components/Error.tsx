interface ErrorProps {
    error: { message: string };
  }
  
export const Error = ({ error }: ErrorProps) => {
    if (!error || !error.message) return null;
      return <div>Error: {error.message}</div>;
  };