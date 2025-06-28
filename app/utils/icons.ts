import { BookOpen, Camera, Gamepad2, Github, Globe, Heart, Instagram, Mail, Music, Phone, ShoppingBag, Star, Twitter, Youtube, Zap } from "lucide-react";

export const iconOptions = [
  { value: "instagram", label: "Instagram", icon: Instagram, color: "text-pink-600" },
  { value: "twitter", label: "Twitter", icon: Twitter, color: "text-blue-500" },
  { value: "youtube", label: "YouTube", icon: Youtube, color: "text-red-600" },
  { value: "website", label: "Website", icon: Globe, color: "text-gray-600" },
  { value: "email", label: "Email", icon: Mail, color: "text-blue-600" },
  { value: "phone", label: "Phone", icon: Phone, color: "text-green-600" },
  { value: "camera", label: "Photography", icon: Camera, color: "text-purple-600" },
  { value: "music", label: "Music", icon: Music, color: "text-green-500" },
  { value: "shop", label: "Shop", icon: ShoppingBag, color: "text-orange-600" },
  { value: "blog", label: "Blog", icon: BookOpen, color: "text-indigo-600" },
  { value: "gaming", label: "Gaming", icon: Gamepad2, color: "text-purple-500" },
  { value: "heart", label: "Favorite", icon: Heart, color: "text-red-500" },
  { value: "star", label: "Featured", icon: Star, color: "text-yellow-500" },
  { value: "zap", label: "Quick Link", icon: Zap, color: "text-yellow-600" },
  { value: "github", label: "GitHub", icon: Github, color: "text-gray-600" },
];

export function getIconComponent(iconName: string) {
  const iconOption = iconOptions.find((option) => option.value === iconName);
  return iconOption 
    ? { icon: iconOption.icon, color: iconOption.color } 
    : { icon: Globe, color: "text-gray-600" };
} 