import { useNavigation } from "react-router"

type FormMethods = "POST" | "PUT" | "PATCH";
export const useIsSubmitting = async (formMethod?: FormMethods) => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  if (!formMethod) return isSubmitting;


  return (
    isSubmitting && navigation.formMethod?.toUpperCase() === formMethod?.toUpperCase()
  )
};
