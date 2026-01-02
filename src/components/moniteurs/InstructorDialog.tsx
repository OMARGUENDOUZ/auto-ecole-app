'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/src/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/src/components/ui/select';
import { Checkbox } from '@/src/components/ui/checkbox';
import { Instructor, InstructorStatus, CreateInstructorInput } from '@/src/types/instructor';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

const formSchema = z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    phone: z.string().min(10),
    licenseNumber: z.string().min(5),
    categories: z.array(z.string()).min(1),
    status: z.nativeEnum(InstructorStatus),
});

interface InstructorDialogProps {
    instructor?: Instructor | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: any) => void;
    isSubmitting?: boolean;
}

const LICENSE_CATEGORIES = ['A1', 'A2', 'B', 'C1', 'C2', 'D', 'E'];

export default function InstructorDialog({
    instructor,
    open,
    onOpenChange,
    onSubmit,
    isSubmitting,
}: InstructorDialogProps) {
    const t = useTranslations('instructors');
    const tc = useTranslations('common');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            phone: '',
            licenseNumber: '',
            categories: ['B'],
            status: InstructorStatus.ACTIVE,
        },
    });

    useEffect(() => {
        if (instructor) {
            form.reset({
                firstName: instructor.firstName,
                lastName: instructor.lastName,
                phone: instructor.phone,
                licenseNumber: instructor.licenseNumber,
                categories: instructor.categories,
                status: instructor.status,
            });
        } else {
            form.reset({
                firstName: '',
                lastName: '',
                phone: '',
                licenseNumber: '',
                categories: ['B'],
                status: InstructorStatus.ACTIVE,
            });
        }
    }, [instructor, form, open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {instructor ? t('editInstructor') : t('addInstructor')}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('lastName')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nom" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('firstName')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Prénom" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('phone')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="05XXXXXXXX" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="licenseNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('licenseNumber')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="12345/XXXX" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('status')}</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choisir un statut" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={InstructorStatus.ACTIVE}>{t('active')}</SelectItem>
                                            <SelectItem value={InstructorStatus.INACTIVE}>{t('inactive')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="categories"
                            render={() => (
                                <FormItem>
                                    <div className="space-y-3">
                                        <FormLabel>{t('categories')}</FormLabel>
                                        <div className="grid grid-cols-4 gap-2 border rounded-md p-3">
                                            {LICENSE_CATEGORIES.map((category) => (
                                                <FormField
                                                    key={category}
                                                    control={form.control}
                                                    name="categories"
                                                    render={({ field }) => {
                                                        return (
                                                            <FormItem
                                                                key={category}
                                                                className="flex flex-row items-start space-x-2 space-y-0"
                                                            >
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value?.includes(category)}
                                                                        onCheckedChange={(checked) => {
                                                                            return checked
                                                                                ? field.onChange([...field.value, category])
                                                                                : field.onChange(
                                                                                    field.value?.filter((value) => value !== category)
                                                                                );
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className="text-sm font-normal">
                                                                    {category}
                                                                </FormLabel>
                                                            </FormItem>
                                                        );
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                {tc('cancel')}
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? tc('loading') : tc('save')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
