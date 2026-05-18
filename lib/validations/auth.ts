import { z } from 'zod'

export const signUpBaseSchema = z.object({
  email: z.email('Enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  repeatPassword: z.string().min(6, 'Value must match the password'),
  firstName: z.string().trim().min(1, 'First name is required.'),
  lastName: z.string().trim().min(1, 'Last name is required.'),
  phone: z.e164('Enter a valid phone number, including country code.'),
})

export const signUpSchema = signUpBaseSchema.refine(
  (data) => data.password === data.repeatPassword,
  {
    message: 'Passwords do not match.',
    path: ['repeatPassword'],
  },
)

export const signUpApiSchema = signUpBaseSchema.omit({ repeatPassword: true })

export type SignUpFormValues = z.infer<typeof signUpBaseSchema>


