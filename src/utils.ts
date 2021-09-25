export const createStyleSheet = (listStyles: string[] | undefined) => {
  if (!listStyles) {
    return `const styles = StyleSheet.create({});`;
  }
  const separator = ':{\n\t\t\n\t},\n';
  let styleSheet = listStyles.reduce((pre, curr) => {
    return pre + '\t' + curr + separator;
  }, '');
  styleSheet = styleSheet.slice(0, styleSheet.length - 2);
  return `const styles = StyleSheet.create({\n${styleSheet}\n});
`;
};
