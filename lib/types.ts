export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface Dog {
  id: string;
  user_id: string;
  name: string;
  breed: string;
  birthday: string;
  photo_url: string | null;
  created_at: string;
}

export interface Memory {
  id: string;
  user_id: string;
  dog_id: string;
  title: string;
  caption: string;
  mood: 'playful' | 'sleepy' | 'adventurous' | 'cuddly';
  date: string;
  created_at: string;
  media?: Media[];
}

export interface Media {
  id: string;
  memory_id: string;
  file_url: string;
  file_type: 'photo' | 'video';
  created_at: string;
}

export interface AIArt {
  id: string;
  dog_id: string;
  prompt: string;
  image_url: string;
  style: string;
  created_at: string;
}
