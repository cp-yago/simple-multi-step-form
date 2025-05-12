import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MultiStepFormPage } from "../multi-step-form";

const fakeData = {
  name: "Yago Cunha",
  email: "yago@gmail.com",
  street: "Paulista Avenue",
  number: 100
}

const LOCAL_STORAGE_KEY = "multistep_form_data"

beforeEach(() => {
  localStorage.clear()
})

describe("Multi-step form", () => {
  describe("Personal Information", () => {
    test("Previous should not be visible at first step", () => {
      const { queryByText } = render(<MultiStepFormPage />)

      expect(queryByText("Previous")).toBeNull()
    });
    test("Should display error when form is not valid", async () => {
      const { queryByText, findByText } = render(<MultiStepFormPage />)

      await userEvent.click(queryByText("Next")!)

      const InvalidNameMessage = await findByText(/String must contain at least 1 character/)
      const InvalidEmailMessage = await findByText(/Invalid email/)

      expect(InvalidNameMessage).toBeInTheDocument()
      expect(InvalidEmailMessage).toBeInTheDocument()
    });
    test("Should go to next section if information is filled correctly", async () => {
      const { queryByText, findByText } = render(<MultiStepFormPage />)

      await userEvent.type(screen.getByPlaceholderText("name"), fakeData.name)
      await userEvent.type(screen.getByPlaceholderText("email"), fakeData.email)

      await userEvent.click(queryByText("Next")!)

      expect(await findByText("Address")).toBeInTheDocument()
    })
    test("Data should be stored in local storage", async () => {
      const { queryByText } = render(<MultiStepFormPage />)

      await userEvent.type(screen.getByPlaceholderText("name"), fakeData.name)
      await userEvent.type(screen.getByPlaceholderText("email"), fakeData.email)

      await userEvent.click(queryByText("Next")!)

      const localStorageData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "")

      expect(localStorageData.name).toBe(fakeData.name)
      expect(localStorageData.email).toBe(fakeData.email)
    })
  })
});
