'use client';

import { Control, useFieldArray } from 'react-hook-form';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/src/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';
import { Plus, Trash2, Award } from 'lucide-react';
import { LICENSE_OPTIONS } from '@/src/lib/constants';
import { useTranslations } from 'next-intl';

interface OwnedLicensesFieldProps {
  control: Control<any>;
  name?: string;
}

export default function OwnedLicensesField({
  control,
  name = 'ownedLicense',
}: OwnedLicensesFieldProps) {
  const t = useTranslations('candidats');
  const tLicense = useTranslations('license');

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const addLicense = () => {
    append({
      obtentionDate: '',
      licenseNumber: '',
      licenseCategory: 'B',
      issueDate: '',
      issuingAuthority: '',
      expirationDate: '',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-base font-semibold flex items-center gap-2">
            <Award className="h-5 w-5" />
            {t('ownedLicenses')}
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            {t('ownedLicensesDescription')}
          </p>
        </div>
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={addLicense}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          {t('addLicense')}
        </Button>
      </div>

      {fields.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <Award className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">
              {t('noOwnedLicensesDescription')}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addLicense}
              className="gap-2 mt-4"
            >
              <Plus className="h-4 w-4" />
              {t('addLicense')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {fields.map((field, index) => (
            <Card key={field.id} className="overflow-hidden">
              <CardHeader className="pb-3 bg-slate-50 dark:bg-slate-900/20">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">
                        {t('license')} {(fields[index] as any).licenseCategory || 'B'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {t('licenseNumber')}: {(fields[index] as any).licenseNumber || '-'}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name={`${name}.${index}.licenseCategory`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('licenseCategory')} <span className="text-destructive">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('selectCategory')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {LICENSE_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {tLicense(option.labelKey)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`${name}.${index}.licenseNumber`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('licenseNumber')} <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={t('licenseNumberPlaceholder')}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`${name}.${index}.obtentionDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('obtentionDate')} <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="date"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`${name}.${index}.issueDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('issueDate')} <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`${name}.${index}.issuingAuthority`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('issuingAuthority')} <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={t('issuingAuthorityPlaceholder')}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`${name}.${index}.expirationDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('expirationDate')} <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
