export enum Theme {
  Light = 'light',
  Warm = 'warm',
  Blue = 'blue',
  Dark = 'dark',
  Darker = 'darker',
  Darkest = 'darkest',
}

export enum TextSize {
  Smallest = 'smallest',
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
  Largest = 'largest',
}

export enum Language {
  Chinese = 'zh-CN',
  English = 'en-US',
}

export type Settings = {
  language:Language;
  theme: Theme;
  textSize: TextSize;
  accentColor: string;
  accentTextColor: 'light' | 'dark';
};
