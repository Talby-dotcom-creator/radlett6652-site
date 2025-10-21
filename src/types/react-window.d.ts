declare module "react-window" {
  import * as React from "react";
  export type ListChildComponentProps = {
    index: number;
    style: React.CSSProperties;
    data?: any;
  };
  export class FixedSizeList extends React.Component<any, any> {}
  export default FixedSizeList;
}
