// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { PlusCircle, Edit, Save } from "lucide-react"
// import Pagination from "./Pagination"

// interface Vaccination {
//   id: string
//   vaccineName: string
//   medicineName: string
//   date: string
//   dueDate: string
// }

// interface Deworming {
//   id: string
//   medicineName: string
//   date: string
//   nextDueDate: string
// }

// interface PetVaxCardProps {
//   petName: string
//   petImage: string
//   veterinarian: string
//   vaccinations: Vaccination[]
//   dewormings: Deworming[]
// }

// export default function Component({ 
//   petName = "Buddy", 
//   petImage = "/placeholder.svg?height=100&width=100", 
//   veterinarian = "Dr. Smith",
//   vaccinations: initialVaccinations = [
//     { id: "1", vaccineName: "Rabies", medicineName: "RabVac", date: "2023-05-15", dueDate: "2024-05-15" },
//     { id: "2", vaccineName: "DHPP", medicineName: "Vanguard Plus", date: "2023-06-01", dueDate: "2024-06-01" },
//     { id: "3", vaccineName: "Bordetella", medicineName: "Bronchi-Shield", date: "2023-07-01", dueDate: "2024-01-01" }
//   ],
//   dewormings: initialDewormings = [
//     { id: "1", medicineName: "Drontal Plus", date: "2023-04-01", nextDueDate: "2023-07-01" },
//     { id: "2", medicineName: "Heartgard Plus", date: "2023-05-01", nextDueDate: "2023-06-01" }
//   ]
// }: PetVaxCardProps) {
//   const [isEditing, setIsEditing] = useState(false)
//   const [vaccinations, setVaccinations] = useState(initialVaccinations)
//   const [dewormings, setDewormings] = useState(initialDewormings)
//   const [newVaccine, setNewVaccine] = useState<Omit<Vaccination, 'id'>>({ vaccineName: '', medicineName: '', date: '', dueDate: '' })
//   const [newDeworming, setNewDeworming] = useState<Omit<Deworming, 'id'>>({ medicineName: '', date: '', nextDueDate: '' })

//   const toggleEdit = () => {
//     setIsEditing(!isEditing)
//   }

//   const handleSave = () => {
//     setIsEditing(false)
//     // Here you would typically send the updated data to your backend
//   }

//   const handleAddVaccine = () => {
//     const id = String(vaccinations.length + 1)
//     setVaccinations([...vaccinations, { id, ...newVaccine }])
//     setNewVaccine({ vaccineName: '', medicineName: '', date: '', dueDate: '' })
//   }

//   const handleAddDeworming = () => {
//     const id = String(dewormings.length + 1)
//     setDewormings([...dewormings, { id, ...newDeworming }])
//     setNewDeworming({ medicineName: '', date: '', nextDueDate: '' })
//   }

//   const handleVaccinationChange = (id: string, field: keyof Vaccination, value: string) => {
//     setVaccinations(vaccinations.map(v => v.id === id ? { ...v, [field]: value } : v))
//   }

//   const handleDewormingChange = (id: string, field: keyof Deworming, value: string) => {
//     setDewormings(dewormings.map(d => d.id === id ? { ...d, [field]: value } : d))
//   }

//   return (
//     <Card className="w-full max-w-4xl">
//       <CardHeader className="flex flex-row items-center justify-between">
//         <div className="flex items-center gap-4">
//           <Avatar className="h-20 w-20">
//             <AvatarImage src={petImage} alt={petName} />
//             <AvatarFallback>{petName[0]}</AvatarFallback>
//           </Avatar>
//           <div>
//             <CardTitle className="text-2xl">{petName}</CardTitle>
//             <p className="text-sm text-muted-foreground">Health Record</p>
//           </div>
//         </div>
//         <div className="text-right">
//           <p className="font-medium">Veterinarian</p>
//           <p className="text-sm text-muted-foreground">{veterinarian}</p>
//         </div>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         <div className="flex justify-between items-center">
//           <h3 className="text-lg font-semibold">Deworming Record</h3>
//           <div className="space-x-2">
//             <Button variant="outline" size="sm" onClick={isEditing ? handleSave : toggleEdit}>
//               {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
//               {isEditing ? "Save" : "Edit"}
//             </Button>
//             <Dialog>
//               <DialogTrigger asChild>
//                 <Button variant="outline" size="sm">
//                   <PlusCircle className="w-4 h-4 mr-2" />
//                   Add
//                 </Button>
//               </DialogTrigger>
//               <DialogContent>
//                 <DialogHeader>
//                   <DialogTitle>Add New Deworming Record</DialogTitle>
//                 </DialogHeader>
//                 <div className="grid gap-4 py-4">
//                   <div className="grid grid-cols-4 items-center gap-4">
//                     <Label htmlFor="medicineName" className="text-right">
//                       Medicine
//                     </Label>
//                     <Input
//                       id="medicineName"
//                       value={newDeworming.medicineName}
//                       onChange={(e) => setNewDeworming({ ...newDeworming, medicineName: e.target.value })}
//                       className="col-span-3"
//                     />
//                   </div>
//                   <div className="grid grid-cols-4 items-center gap-4">
//                     <Label htmlFor="date" className="text-right">
//                       Date
//                     </Label>
//                     <Input
//                       id="date"
//                       type="date"
//                       value={newDeworming.date}
//                       onChange={(e) => setNewDeworming({ ...newDeworming, date: e.target.value })}
//                       className="col-span-3"
//                     />
//                   </div>
//                   <div className="grid grid-cols-4 items-center gap-4">
//                     <Label htmlFor="nextDueDate" className="text-right">
//                       Next Due Date
//                     </Label>
//                     <Input
//                       id="nextDueDate"
//                       type="date"
//                       value={newDeworming.nextDueDate}
//                       onChange={(e) => setNewDeworming({ ...newDeworming, nextDueDate: e.target.value })}
//                       className="col-span-3"
//                     />
//                   </div>
//                 </div>
//                 <Button onClick={handleAddDeworming}>Add Deworming Record</Button>
//               </DialogContent>
//             </Dialog>
//           </div>
//         </div>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Medicine</TableHead>
//               <TableHead>Date Given</TableHead>
//               <TableHead>Next Due Date</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {dewormings.map((deworming) => (
//               <TableRow key={deworming.id}>
//                 <TableCell className="font-medium">
//                   {isEditing ? (
//                     <Input
//                       value={deworming.medicineName}
//                       onChange={(e) => handleDewormingChange(deworming.id, 'medicineName', e.target.value)}
//                     />
//                   ) : (
//                     deworming.medicineName
//                   )}
//                 </TableCell>
//                 <TableCell>
//                   {isEditing ? (
//                     <Input
//                       type="date"
//                       value={deworming.date}
//                       onChange={(e) => handleDewormingChange(deworming.id, 'date', e.target.value)}
//                     />
//                   ) : (
//                     deworming.date
//                   )}
//                 </TableCell>
//                 <TableCell>
//                   {isEditing ? (
//                     <Input
//                       type="date"
//                       value={deworming.nextDueDate}
//                       onChange={(e) => handleDewormingChange(deworming.id, 'nextDueDate', e.target.value)}
//                     />
//                   ) : (
//                     <Badge variant={new Date(deworming.nextDueDate) > new Date() ? "secondary" : "destructive"}>
//                       {deworming.nextDueDate}
//                     </Badge>
//                   )}
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>

//         <div className="flex justify-between items-center">
//           <h3 className="text-lg font-semibold">Vaccination Record</h3>
//           <div className="space-x-2">
//             <Button variant="outline" size="sm" onClick={isEditing ? handleSave : toggleEdit}>
//               {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
//               {isEditing ? "Save" : "Edit"}
//             </Button>
//             <Dialog>
//               <DialogTrigger asChild>
//                 <Button variant="outline" size="sm">
//                   <PlusCircle className="w-4 h-4 mr-2" />
//                   Add
//                 </Button>
//               </DialogTrigger>
//               <DialogContent>
//                 <DialogHeader>
//                   <DialogTitle>Add New Vaccination Record</DialogTitle>
//                 </DialogHeader>
//                 <div className="grid gap-4 py-4">
//                   <div className="grid grid-cols-4 items-center gap-4">
//                     <Label htmlFor="vaccineName" className="text-right">
//                       Vaccine
//                     </Label>
//                     <Input
//                       id="vaccineName"
//                       value={newVaccine.vaccineName}
//                       onChange={(e) => setNewVaccine({ ...newVaccine, vaccineName: e.target.value })}
//                       className="col-span-3"
//                     />
//                   </div>
//                   <div className="grid grid-cols-4 items-center gap-4">
//                     <Label htmlFor="medicineName" className="text-right">
//                       Medicine
//                     </Label>
//                     <Input
//                       id="medicineName"
//                       value={newVaccine.medicineName}
//                       onChange={(e) => setNewVaccine({ ...newVaccine, medicineName: e.target.value })}
//                       className="col-span-3"
//                     />
//                   </div>
//                   <div className="grid grid-cols-4 items-center gap-4">
//                     <Label htmlFor="date" className="text-right">
//                       Date
//                     </Label>
//                     <Input
//                       id="date"
//                       type="date"
//                       value={newVaccine.date}
//                       onChange={(e) => setNewVaccine({ ...newVaccine, date: e.target.value })}
//                       className="col-span-3"
//                     />
//                   </div>
//                   <div className="grid grid-cols-4 items-center gap-4">
//                     <Label htmlFor="dueDate" className="text-right">
//                       Due Date
//                     </Label>
//                     <Input
//                       id="dueDate"
//                       type="date"
//                       value={newVaccine.dueDate}
//                       onChange={(e) => setNewVaccine({ ...newVaccine, dueDate: e.target.value })}
//                       className="col-span-3"
//                     />
//                   </div>
//                 </div>
//                 <Button onClick={handleAddVaccine}>Add Vaccination Record</Button>
//               </DialogContent>
//             </Dialog>
//           </div>
//         </div>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Vaccine</TableHead>
//               <TableHead>Medicine</TableHead>
//               <TableHead>Date Given</TableHead>
//               <TableHead>Due Date</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {vaccinations.map((vax) => (
//               <TableRow key={vax.id}>
//                 <TableCell className="font-medium">
//                   {isEditing ? (
//                     <Input
//                       value={vax.vaccineName}
//                       onChange={(e) => handleVaccinationChange(vax.id, 'vaccineName', e.target.value)}
//                     />
//                   ) : (
//                     vax.vaccineName
//                   )}
//                 </TableCell>
//                 <TableCell>
//                   {isEditing ? (
//                     <Input
//                       value={vax.medicineName}
//                       onChange={(e) => handleVaccinationChange(vax.id, 'medicineName', e.target.value)}
//                     />
//                   ) : (
//                     vax.medicineName
//                   )}
//                 </TableCell>
//                 <TableCell>
//                   {isEditing ? (
//                     <Input
//                       type="date"
//                       value={vax.date}
//                       onChange={(e) => handleVaccinationChange(vax.id, 'date', e.target.value)}
//                     />
//                   ) : (
//                     vax.date
//                   )}
//                 </TableCell>
//                 <TableCell>
//                   {isEditing ? (
//                     <Input
//                       type="date"
//                       value={vax.dueDate}
//                       onChange={(e) => handleVaccinationChange(vax.id, 'dueDate', e.target.value)}
//                     />
//                   ) : (
//                     <Badge variant={new Date(vax.dueDate) > new Date() ? "secondary" : "destructive"}>
//                       {vax.dueDate}
//                     </Badge>
//                   )}
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </CardContent>
//     </Card>
//   )
// }