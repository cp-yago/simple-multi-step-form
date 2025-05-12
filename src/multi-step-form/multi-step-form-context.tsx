import { createContext, useContext, useState, type ReactNode } from "react";
import { z } from "zod";

// Schema definition

export const formSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  street: z.string().min(1),
  number: z.coerce.number().nullable(),
  receiveMarketingEmails: z.boolean(),
  receiveNotifications: z.boolean(),
})

export type InputData = z.infer<typeof formSchema>

export type Steps = 'personal-info' | 'address' | 'preferences' | 'review'

const STORAGE_KEY = "multistep_form_data";

interface MultiStepFormContextProps {
  currentStep: Steps
  handleStepChange: (direction: "previous" | "next") => void,
  formData: InputData,
  updateFormData: (data: Partial<InputData>) => void
}

const MultiStepFormContext = createContext<MultiStepFormContextProps>({} as MultiStepFormContextProps)

interface MultiStepFormContextProviderProps {
  children: ReactNode
}

export function MultiStepFormContextProvider({ children }: MultiStepFormContextProviderProps) {
  const initialFormData: InputData = {
    name: '',
    email: '',
    number: null,
    street: '',
    receiveMarketingEmails: false,
    receiveNotifications: false
  }
  const [currentStep, setCurrentStep] = useState<Steps>("personal-info")
  const [formData, setFormData] = useState<InputData>(() => {
    const savedData = localStorage.getItem(STORAGE_KEY)
    return savedData ? JSON.parse(savedData) : initialFormData
  })

  const stepsOrder: Steps[] = ["personal-info", "address", "preferences", "review"]

  const handleStepChange = (direction: "previous" | "next") => {
    const currentStepIndex = stepsOrder.findIndex((step) => step === currentStep)
    const nextStepIndex = direction === "next" ? currentStepIndex + 1 : currentStepIndex - 1
    const nextStep = stepsOrder[nextStepIndex] || stepsOrder[currentStepIndex]
    setCurrentStep(nextStep)
  }

  const updateFormData = (data: Partial<InputData>) => {
    const updatedData = { ...formData, ...data }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData))
    setFormData(updatedData)
    console.log("updated data: ", updatedData)
  }

  const contextValue: MultiStepFormContextProps = {
    currentStep,
    handleStepChange,
    formData,
    updateFormData
  }

  return (
    <MultiStepFormContext.Provider value={contextValue}>
      {children}
    </MultiStepFormContext.Provider>
  )
}

export function useMultiStepFormContext() {
  const context = useContext(MultiStepFormContext)
  if (!context) {
    throw new Error(
      "useMultistepFormContext must be used within a MultistepFormContextProvider",
    );
  }
  return context
}


