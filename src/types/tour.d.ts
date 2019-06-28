declare module '*.svelte' {
  const component: {
    default: {
      render (tpl: any): any;
    }
  };
  export default component;
}
