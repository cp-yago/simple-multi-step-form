import { zodResolver } from "@hookform/resolvers/zod"
import type { JSX } from "react"
import { useForm, type SubmitHandler, } from "react-hook-form"
import { z } from "zod"
import { formSchema, useMultiStepFormContext, type Steps } from "./multi-step-form-context"

function PersonalInformation() {
  const { handleStepChange, updateFormData, formData } = useMultiStepFormContext()
  const personalInformationSchema = formSchema.pick({ name: true, email: true })
  type PersonalInformationData = z.infer<typeof personalInformationSchema>

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(personalInformationSchema),
    defaultValues: { name: formData.name, email: formData.email }
  })

  const onSubmit: SubmitHandler<PersonalInformationData> = (data) => {
    updateFormData(data)
    handleStepChange("next")
  }

  return (
    <div>
      <h1>Personal Information</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <h1>name</h1>
        <input type="text" {...register("name")} className="border" />

        <h1>email</h1>
        <input type="text" {...register("email")} className="border" />
        <button type="submit" className="border">Next</button>
      </form>
      <ul>
        {Object.entries(errors).map(([field, error]) => (
          <li key={field}>
            {field}: {error.message}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Address() {
  const { handleStepChange, formData, updateFormData } = useMultiStepFormContext()
  const addressFormSchema = formSchema.pick({ street: true, number: true })
  type AddressFormData = z.infer<typeof addressFormSchema>

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(addressFormSchema),
    defaultValues: { street: formData.street, number: formData.number }
  })

  const onSubmit: SubmitHandler<AddressFormData> = (data) => {
    console.log("chamou data: ", data)
    updateFormData(data)
    handleStepChange("next")
  }

  console.log("errors: ", errors)

  return (
    <div>
      <h1>Address</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <h1>Street</h1>
        <input type="text" {...register("street")} className="border" />

        <h1>Number</h1>
        <input type="number" {...register("number")} className="border" />
        <button className="border" onClick={() => handleStepChange("previous")}>Previous</button>
        <button type="submit" className="border">Next</button>
      </form>
      <ul>
        {Object.entries(errors).map(([field, error]) => (
          <li key={field}>
            {field}: {error.message}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Preferences() {
  const preferencesFormSchema = formSchema.pick({ receiveMarketingEmails: true, receiveNotifications: true })
  type PreferencesFormData = z.infer<typeof preferencesFormSchema>

  const { handleStepChange, updateFormData, formData } = useMultiStepFormContext()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(preferencesFormSchema),
    defaultValues: { receiveMarketingEmails: formData.receiveMarketingEmails, receiveNotifications: formData.receiveNotifications }
  })

  const onSubmit: SubmitHandler<PreferencesFormData> = (data) => {
    console.log("preferences form", data)
    updateFormData(data)
    handleStepChange("next")
  }

  return (
    <>
      <h1>Preferences</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <h1>Receive Marketing Notifications</h1>
        <input type="checkbox" {...register("receiveMarketingEmails")} />

        <h1>Receive Marketing Notifications</h1>
        <input type="checkbox" {...register("receiveNotifications")} />

        <button className="border" onClick={() => handleStepChange("previous")}>Previous</button>
        <button type="submit" className="border">Next</button>
      </form>
      <ul>
        {Object.entries(errors).map(([field, error]) => (
          <li key={field}>
            {field}: {error.message}
          </li>
        ))}
      </ul>
    </>
  )
}

function Review() {
  const { formData, handleStepChange } = useMultiStepFormContext()

  return (
    <>
      <h1 className="font-bold mt-4">Review your informations</h1>
      <br />

      <h1 className="font-bold">Personal Information</h1>
      <h2>Name: {formData.name}</h2>
      <h2>Email: {formData.email}</h2>
      <br />

      <h1 className="font-bold">Address</h1>
      <h2>Street: {formData.street}</h2>
      <h2>Number: {formData.number}</h2>
      <br />

      <h1 className="font-bold">Preferences</h1>
      <h2>Receive marketings: {formData.receiveMarketingEmails ? "Yes" : "No"}</h2>
      <h2>Receive notifications: {formData.receiveNotifications ? "Yes" : "No"}</h2>
      <br />

      <button className="border" onClick={() => handleStepChange("previous")}>Previous</button>
      <button type="submit" className="border">Next</button>
    </ >

  )
}

const stepsMap: Record<Steps, JSX.Element> = {
  "personal-info": <PersonalInformation />,
  address: <Address />,
  preferences: <Preferences />,
  review: <Review />
}

export function MultiStepForm() {
  const { currentStep } = useMultiStepFormContext()

  return (
    <div className="flex flex-col">
      <h1 className="font-bold text-2xl">Simple multi-step form</h1>
      {stepsMap[currentStep]}
    </div>
  )
}