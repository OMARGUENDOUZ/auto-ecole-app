declare module '@radix-ui/react-dialog' {
  // Minimal ambient module declaration to satisfy TypeScript when official types
  // are not available or the editor can't resolve them. Exporting as `any`
  // prevents type errors such as incompatibilities with React.ElementRef.
  const Root: any;
  const Trigger: any;
  const Portal: any;
  const Overlay: any;
  const Content: any;
  const Close: any;
  const Title: any;
  const Description: any;
  export { Root, Trigger, Portal, Overlay, Content, Close, Title, Description };
  export default Root;
}
