import { DialogContent, DialogTitle, DialogClose, DialogDescription } from './ui/dialog'
import { RadioGroup, RadioGroupItem, RadioGroupIndicator } from './ui/radio-group'
import { X } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'
import { createGoal } from '../http/create-goal'
import { useQueryClient } from '@tanstack/react-query'

const createGoalSchema = z.object({
  title: z.string().min(1, 'Informe a atividade que deseja praticar'),
  desiredWeeklyFrequency: z.coerce.number().min(1).max(7),
})

type CreateGoalSchema = z.infer<typeof createGoalSchema>

export function CreateGoal() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<CreateGoalSchema>({
    resolver: zodResolver(createGoalSchema),
  })

  const queryClient = useQueryClient()

  async function handleCreateGoal({ title, desiredWeeklyFrequency }: CreateGoalSchema) {
    try {
      await createGoal({
        title,
        desiredWeeklyFrequency,
      })

      reset()

      queryClient.invalidateQueries({ queryKey: ['pending-goals'] })
      queryClient.invalidateQueries({ queryKey: ['summary'] })

      toast.success('Meta criada com sucesso!')
    } catch {
      toast.error('Erro ao criar a meta, tente novamente!')
    }
  }

  return (
    <DialogContent>
      <div className="flex flex-col gap-6 h-full">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <DialogTitle>Cadastrar meta</DialogTitle>
            <DialogClose>
              <X className="size-5 text-zinc-600" />
            </DialogClose>
          </div>
          <DialogDescription>
            Adicione atividades que te fazem bem e que você quer continuar praticando toda semana.
          </DialogDescription>
        </div>
        <form className="flex flex-1 flex-col justify-between" onSubmit={handleSubmit(handleCreateGoal)}>
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Qual a atividade?</Label>

              <Input id="title" autoFocus placeholder="Praticar exercícios, meditar, etc..." {...register('title')} />

              {errors.title && <p className="text-sm text-red-400">{errors.title.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="desiredWeeklyFrequency">Quantas vezes na semana?</Label>

              <Controller
                control={control}
                name="desiredWeeklyFrequency"
                defaultValue={5}
                render={({ field }) => {
                  return (
                    <RadioGroup value={String(field.value)} onValueChange={field.onChange}>
                      {Array.from({ length: 7 }).map((_, i) => {
                        const frequency = String(i + 1)

                        return (
                          <RadioGroupItem key={i} value={frequency}>
                            <RadioGroupIndicator />
                            <span className="text-zinc-300 text-sm font-medium leading-none">
                              {frequency}x na semana
                            </span>
                            <span className="text-lg leading-none">🥱</span>
                          </RadioGroupItem>
                        )
                      })}
                    </RadioGroup>
                  )
                }}
              />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-auto">
            <DialogClose asChild>
              <Button type="button" className="flex-1" variant="secondary">
                Fechar
              </Button>
            </DialogClose>
            <Button className="flex-1">Salvar</Button>
          </div>
        </form>
      </div>
    </DialogContent>
  )
}
