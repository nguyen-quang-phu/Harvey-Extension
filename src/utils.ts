export const extractStyleSheet = (text: string) => {
  const end = text.indexOf(';');
  return text.slice(0, end + 1);
};

interface ListStyles {
  [key: string]: string;
}

export const extractListStyles = (text: string) => {
  const list = text.split(/},\n/);
  list[0] = list[0].split('\n').slice(1).join('\n');
  const res = list.slice(0, list.length - 1).reduce((pre, style) => {
    const temp = style.trim() + '\n\t},\n';
    const index = temp.indexOf(':');
    const key = temp.slice(0, index);
    let value = temp.slice(index + 1).trim();
    if (value === '{\n\t},') {
      value = '{\n\t\t\n\t},';
    }
    return { ...pre, [key]: value };
  }, {} as ListStyles);
  return res;
};
export const getLineEndStyleSheet = (textContainStyleSheet: string) => {
  const list = textContainStyleSheet.split('\n');
  const n = list.length;
  let res = -1;
  for (let i = 0; i < n; i++) {
    if (list[i].includes(';')) {
      res = i;
      break;
    }
  }
  return res;
};

export const createStyleSheet = (
  listStyles: string[] | undefined,
  textContainStyleSheet: string,
) => {
  if (!listStyles) {
    return `const styles = StyleSheet.create({});`;
  }
  const uniqueListStyles = Array.from(new Set(listStyles));
  const currentStyleSheet = extractStyleSheet(textContainStyleSheet);
  const oldListStyles = extractListStyles(currentStyleSheet);
  const separator = ' :{\n\t\t\n\t},\n';
  let styleSheet = uniqueListStyles.reduce((pre, curr) => {
    const properties = oldListStyles[curr];
    if (properties) {
      return pre + '\t' + curr + ': ' + properties + '\n';
    }
    return pre + '\t' + curr + separator;
  }, '');
  styleSheet = styleSheet.slice(0, styleSheet.length - 2);
  // console.log(styleSheet);
  return `const styles = StyleSheet.create({\n${styleSheet}\n});
`;
};
