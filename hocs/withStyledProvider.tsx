import { StyledProvider } from "@gluestack-ui/themed";
import { FC } from "react";
import { config } from "../config/gluestack-ui.config";

export const withStyledProvider = (WrappedComponent: FC) => {
  const WithStyledProvider: FC = (props) => (
    <StyledProvider config={config}>
      <WrappedComponent {...props} />
    </StyledProvider>
  );

  return WithStyledProvider;
};
