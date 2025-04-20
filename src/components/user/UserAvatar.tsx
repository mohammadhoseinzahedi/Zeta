import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type User = {
  image: string | null;
  username: string;
  name: string | null;
};

const UserAvatar = ({ user }: { user?: User }) => {
  const fallbackText =
    user?.name?.charAt(0).toUpperCase() ??
    user?.username.charAt(0).toUpperCase() ??
    "U";
  return (
    <Avatar>
      <AvatarImage
        src={user?.image ?? "/img_avatar.png"}
        alt={`${user?.name ?? user?.username} Avatar`}
      />
      <AvatarFallback>{fallbackText}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
