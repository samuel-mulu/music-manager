declare module "@styled-system/css" {
  interface CSSObject {
    [key: string]: any;
  }

  export function css(styles: CSSObject): string;
}
