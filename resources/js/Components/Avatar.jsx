export default function Avatar({ user, size = "md" }) {

  const sizes = {
      sm: "w-8 h-8 text-xs",
      md: "w-9 h-9 text-sm",
      lg: "w-12 h-12 text-base"
  };

  const avatarSize = sizes[size] || sizes.md;

  const avatarUrl = user?.avatar
      ? user.avatar.startsWith("http")
          ? user.avatar
          : `/storage/${user.avatar}`
      : null;

  return (
      <div
          className={`${avatarSize} rounded-full overflow-hidden
          bg-gradient-to-br from-indigo-500 to-purple-600
          flex items-center justify-center text-white
          font-semibold shadow-md`}
      >
          {avatarUrl ? (
              <img
                  src={avatarUrl}
                  alt={user?.name}
                  className="w-full h-full object-cover"
              />
          ) : (
              user?.name?.charAt(0).toUpperCase()
          )}
      </div>
  );
}