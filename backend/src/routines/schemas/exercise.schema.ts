// src/routines/schemas/exercise.schema.ts
import { z } from 'zod';

export const exerciseSchema = z.object({
  nome: z
    .string()
    .min(1, "Nome do exercício é obrigatório")
    .max(100, "Nome do exercício pode ter no máximo 100 caracteres")
    .regex(/^[A-Za-z\s]+$/, "Nome do exercício deve conter apenas letras e espaços"),
  tipo: z
    .string()
    .min(1, "Tipo do exercício é obrigatório")
    .max(50, "Tipo do exercício pode ter no máximo 50 caracteres")
    .regex(/^[A-Za-z\s]+$/, "Tipo do exercício deve conter apenas letras e espaços"),
});

export type Exercise = z.infer<typeof exerciseSchema>;
