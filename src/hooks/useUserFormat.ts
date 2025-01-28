const getName = (user: Partial<UserData> | undefined) => {
  const { firstName = '', lastName = '' } = user ?? {};
  if (!firstName && !lastName) {
    return '';
  }
  if (!firstName) {
    return lastName;
  }
  if (!lastName) {
    return firstName;
  }
  return `${firstName} ${lastName}`;
};

const useUserFormat = (user: Partial<UserData> | undefined) => {
  return {
    name: getName(user),
    photo: user?.userPhotos?.length
      ? user?.userPhotos?.[user?.userPhotos?.length - 1]?.fileDTO?.filePath
      : undefined,
  };
};

export default useUserFormat;
