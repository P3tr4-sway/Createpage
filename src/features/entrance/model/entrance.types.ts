export type BrowseItem = {
  title: string;
  author: string;
  imageUrl: string;
  avatarInitial: string;
};

export type ShowcaseComment = {
  id: number;
  user: string;
  text: string;
};

export type GuitarClip = BrowseItem & {
  id: string;
  email: string;
  comments: ShowcaseComment[];
};

export type HeroPromptSuggestion = {
  tag: string;
  title: string;
  prompt: string;
};
