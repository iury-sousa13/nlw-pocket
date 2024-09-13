import { Plus, X } from 'lucide-react'
import logo from './assets/in-orbit-logo.svg'
import letsStart from './assets/rocket-launch-illustration.svg'
import { Button } from './components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from './components/ui/dialog'
import { Label } from './components/ui/label'
import { Input } from './components/ui/input'
import { RadioGroup, RadioGroupIndicator, RadioGroupItem } from './components/ui/radio-group'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

const createGoalSchema = z.object({
  title: z.string().min(1, 'Informe a atividade que deseja praticar'),
  desiredWeeklyFrequency: z.coerce.number().min(1).max(7),
})

type CreateGoalSchema = z.infer<typeof createGoalSchema>

export function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<CreateGoalSchema>({
    resolver: zodResolver(createGoalSchema),
  })

  async function handleCreateGoal({ title, desiredWeeklyFrequency }: CreateGoalSchema) {
    try {
      // await createGoal({
      //   title,
      //   desiredWeeklyFrequency,
      // })

      reset()

      // queryClient.invalidateQueries({ queryKey: ['pending-goals'] })
      // queryClient.invalidateQueries({ queryKey: ['summary'] })

      toast.success('Meta criada com sucesso!')
    } catch {
      toast.error('Erro ao criar a meta, tente novamente!')
    }
  }

  return (
    <Dialog>
      <div className="h-screen flex flex-col items-center justify-center gap-8">
        <img src={logo} alt="in.orbit" />
        <img src={letsStart} alt="in.orbit" />
        <p className="text-zinc-300 leading-relaxed max-w-80 text-center">
          Você ainda não cadastrou nenhuma meta, que tal cadastrar um agora mesmo?
        </p>
        <DialogTrigger asChild>
          <Button>
            <Plus className="size-4" /> Cadastrar meta
          </Button>
        </DialogTrigger>
      </div>
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
    </Dialog>
  )
}
