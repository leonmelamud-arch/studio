"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/layout/Header";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(50),
  lastName: z.string().min(2, "Last name must be at least 2 characters.").max(50),
});

export default function QRPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      lastName: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, you'd likely save this to a shared state or database
    // For this demo, we'll just show a success message and redirect.
    toast({
      title: "Participant Added",
      description: `${values.name} ${values.lastName} has been added to the raffle.`,
    });
    console.log("New Participant from QR:", values);
    router.push('/');
  }

  return (
    <main className="flex flex-col items-center min-h-screen w-full p-4 md:p-8">
       <Header />
       <div className="flex-grow flex flex-col items-center justify-center w-full">
        <div className="w-full max-w-md p-8 bg-card rounded-2xl shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-card-foreground">Add Participant</h2>
            <p className="text-muted-foreground">
              Manually add a new participant to the raffle. This simulates a QR code scan.
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-4 mt-4">
                <Button type="button" variant="secondary" onClick={() => router.push('/')} className="w-full">
                    Cancel
                </Button>
                <Button type="submit" className="w-full">Add to Raffle</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
}
