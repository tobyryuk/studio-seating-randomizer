import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

import { useState } from "react"
import { shuffleArray } from "./lib/utils"

const TOTAL_AMOUNT_OF_NAMES_NEEDED = 13
const TOTAL_AMOUNT_OF_BACKROOM_SEATS = 4

function App() {
  const [name, setName] = useState<string>('')
  const [names, setNames] = useState<string[]>([])
  const [selectedNames, setSelectedNames] = useState<string[]>([])
  const [randomizedGroups, setRandomizedGroups] = useState<string[][]>([[], []])

  const { toast } = useToast()

  const onAdd = () => {
    if (name === '') return
    setNames([...names, name])
    setName('')
    console.log(names)
  }

  const onChecked = (nm: string, e: string | boolean) => {
    if (selectedNames.includes(nm) && e === false) {
      setSelectedNames(selectedNames.filter((name) => name !== nm))
      return
    }

    if (!selectedNames.includes(nm) && e === true) {
      setSelectedNames([...selectedNames, nm])
      return
    }
  }

  const onRandomize = () => {
    if (names.length !== TOTAL_AMOUNT_OF_NAMES_NEEDED) {
      if (selectedNames.length !== TOTAL_AMOUNT_OF_BACKROOM_SEATS) {
        toast({
          title: "Failed to randomize",
          description: `Need ${TOTAL_AMOUNT_OF_NAMES_NEEDED} names and ${TOTAL_AMOUNT_OF_BACKROOM_SEATS} selected`,
          action: (
            <ToastAction altText="Dismiss">Dismiss</ToastAction>
          ),
        })
        return
      }

      toast({
        title: "Failed to randomize",
        description: `Need ${TOTAL_AMOUNT_OF_NAMES_NEEDED} names`,
        action: (
          <ToastAction altText="Dismiss">Dismiss</ToastAction>
        ),
      })
      return
    } else if (selectedNames.length !== TOTAL_AMOUNT_OF_BACKROOM_SEATS) {
      toast({
        title: "Failed to randomize",
        description: `Need ${TOTAL_AMOUNT_OF_BACKROOM_SEATS}} selected names`,
        action: (
          <ToastAction altText="Dismiss">Dismiss</ToastAction>
        ),
      })
      return
    }

    const filteredNames = names.filter((name) => !selectedNames.includes(name))
    const shuffledNames = shuffleArray(filteredNames)
    const groupOne = shuffleArray([selectedNames, shuffledNames.slice(0, TOTAL_AMOUNT_OF_BACKROOM_SEATS)].flat())
    const groupTwo = [shuffledNames.slice(TOTAL_AMOUNT_OF_BACKROOM_SEATS, TOTAL_AMOUNT_OF_NAMES_NEEDED)].flat()

    setRandomizedGroups([groupOne, groupTwo])
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <Card>
        <CardHeader>
          <CardTitle>Studio Seating Randomizer</CardTitle>
          <CardDescription>
            Add {TOTAL_AMOUNT_OF_NAMES_NEEDED} people to the list <br/>
            Check {TOTAL_AMOUNT_OF_BACKROOM_SEATS} names of the people who most recently was seated in the back  <br/>
            Click Randomize
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full flex space-x-2">
            <Input className="w-3/4 inline" type="text" placeholder="Name" value={name} onChange={(e) => (setName(e.target.value))} />
            <Button className="w-1/4 inline" onClick={onAdd}>Add</Button>
          </div>
          <Separator className="my-8" />
          <div className="w-full grid grid-cols-3 gap-2 my-4">
          {names.map((nm, index) => (
            <div key={index} className="w-1/2 flex items-center space-x-2 my-4 inline">
              <Checkbox id={`${index}`} value={nm} onCheckedChange={(e) => onChecked(nm, e)} />
              <Label htmlFor={`${index}`}>{nm}</Label>
            </div>
          ))}
          </div>
          <Separator className="my-8" />
          {names.length === TOTAL_AMOUNT_OF_NAMES_NEEDED && selectedNames.length === TOTAL_AMOUNT_OF_BACKROOM_SEATS && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-1/4 float-right mb-4" onClick={onRandomize}>Randomize</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Randomized Seating</DialogTitle>
                  <DialogDescription>
                    Selected names are not in the backrooms. You can close this dialog and randomize again.
                  </DialogDescription>
                </DialogHeader>
                {randomizedGroups[0].length > 0 && randomizedGroups[1].length > 0 && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Seat Nr.</TableHead>
                        <TableHead>Brightside</TableHead>
                        <TableHead>Backrooms</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {randomizedGroups[0].map((randomPerson, index) => (
                        <TableRow key={index}>
                          <TableCell><b>{index + 1}</b></TableCell>
                          <TableCell>{randomPerson}</TableCell>
                          <TableCell>{index <= (TOTAL_AMOUNT_OF_BACKROOM_SEATS - 1) && randomizedGroups[1][index]}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </DialogContent>
            </Dialog>
          )}
    
          {(names.length !== TOTAL_AMOUNT_OF_NAMES_NEEDED || selectedNames.length !== TOTAL_AMOUNT_OF_BACKROOM_SEATS) && (
            <Button className="w-1/4 float-right mb-4" onClick={onRandomize}>Randomize</Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default App
