import { MultiStepForm } from "./form";
import { MultiStepFormContextProvider } from "./multi-step-form-context";

export function MultiStepFormPage() {
  return (
    <MultiStepFormContextProvider>
      <MultiStepForm />
    </MultiStepFormContextProvider>
  )
}