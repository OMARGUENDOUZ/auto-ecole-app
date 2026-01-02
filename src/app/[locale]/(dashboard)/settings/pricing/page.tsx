'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePricings, useUpdatePricing } from '@/src/hooks/use-pricing';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Switch } from '@/src/components/ui/switch';
import { Separator } from '@/src/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/src/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Loader2, Save, DollarSign, Settings as SettingsIcon, Plus, Eye, Edit, X } from 'lucide-react';
import { toast } from 'sonner';
import { Pricing } from '@/src/types/pricing';
import { LicenseCategory } from '@/src/types/candidat';
import api from '@/src/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function PricingConfigPage() {
    const t = useTranslations('pricing');
    const tLicense = useTranslations('license');
    const { data: pricings, isLoading } = usePricings();
    const updatePricing = useUpdatePricing();
    const queryClient = useQueryClient();

    const [selectedPricing, setSelectedPricing] = useState<Pricing | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [newPricingCategory, setNewPricingCategory] = useState<string>('B');

    const createPricing = useMutation({
        mutationFn: async (category: string) => {
            const newPricing = {
                licenseCategory: category,
                baseCourseFee: 30000,
                examUnitFee: 2000,
                stampUnitFee: 300,
                active: true,
                maxVehicles: 2,
                candidatesPerVehicle: 20,
                billExamOnJustifiedAbsence: false,
                billStampOnJustifiedAbsence: false,
                billExamOnUnjustifiedAbsence: false,
                billStampOnUnjustifiedAbsence: true
            };
            const { data } = await api.post('/Pricing', newPricing);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pricings'] });
            toast.success(t('createSuccess'));
            setIsCreateDialogOpen(false);
        },
        onError: () => {
            toast.error(t('createError'));
        }
    });

    const handleSave = () => {
        if (!selectedPricing) return;

        updatePricing.mutate(
            { id: selectedPricing.id, data: selectedPricing },
            {
                onSuccess: () => {
                    toast.success(t('saveSuccess'));
                    setIsDialogOpen(false);
                    setIsEditing(false);
                    setSelectedPricing(null);
                },
                onError: () => {
                    toast.error(t('saveError'));
                }
            }
        );
    };

    const updateField = <K extends keyof Pricing>(field: K, value: Pricing[K]) => {
        if (!selectedPricing) return;
        setSelectedPricing(prev => prev ? { ...prev, [field]: value } : null);
    };

    const openViewDialog = (pricing: Pricing, edit: boolean = false) => {
        setSelectedPricing(pricing);
        setIsEditing(edit);
        setIsDialogOpen(true);
    };

    const availableCategories = Object.values(LicenseCategory).filter(
        cat => !pricings?.some(p => p.licenseCategory === cat)
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container max-w-7xl py-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{t('title')}</h1>
                    <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
                </div>
                {availableCategories.length > 0 && (
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                {t('addPricing')}
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{t('addPricing')}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>{t('selectCategory')}</Label>
                                    <Select value={newPricingCategory} onValueChange={setNewPricingCategory}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableCategories.map(cat => (
                                                <SelectItem key={cat} value={cat}>
                                                    {tLicense(cat)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button
                                    onClick={() => createPricing.mutate(newPricingCategory)}
                                    disabled={createPricing.isPending}
                                    className="w-full"
                                >
                                    {createPricing.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {t('create')}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            {!pricings || pricings.length === 0 ? (
                <Card>
                    <CardContent className="pt-6 text-center">
                        <p className="text-muted-foreground mb-4">{t('noPricingYet')}</p>
                        {availableCategories.length > 0 && (
                            <Button onClick={() => setIsCreateDialogOpen(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                {t('addFirstPricing')}
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('category')}</TableHead>
                                <TableHead className="text-right">{t('trainingFee')}</TableHead>
                                <TableHead className="text-right">{t('examFee')}</TableHead>
                                <TableHead className="text-right">{t('stampFee')}</TableHead>
                                <TableHead className="text-right">{t('totalCapacity')}</TableHead>
                                <TableHead className="text-right">{t('actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pricings.map(pricing => (
                                <TableRow key={pricing.id}>
                                    <TableCell className="font-medium">{tLicense(pricing.licenseCategory)}</TableCell>
                                    <TableCell className="text-right">{pricing.baseCourseFee.toLocaleString()} DA</TableCell>
                                    <TableCell className="text-right">{pricing.examUnitFee.toLocaleString()} DA</TableCell>
                                    <TableCell className="text-right">{pricing.stampUnitFee.toLocaleString()} DA</TableCell>
                                    <TableCell className="text-right">{pricing.maxVehicles * pricing.candidatesPerVehicle}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => openViewDialog(pricing, false)}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => openViewDialog(pricing, true)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            )}

            {/* Detailed View/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <div className="flex items-center justify-between">
                            <DialogTitle>
                                {selectedPricing && tLicense(selectedPricing.licenseCategory)}
                            </DialogTitle>
                            <div className="flex gap-2">
                                {isEditing ? (
                                    <>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setIsDialogOpen(false);
                                                setIsEditing(false);
                                            }}
                                        >
                                            <X className="mr-2 h-3 w-3" />
                                            {t('cancel')}
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={handleSave}
                                            disabled={updatePricing.isPending}
                                        >
                                            {updatePricing.isPending && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                                            <Save className="mr-2 h-3 w-3" />
                                            {t('save')}
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        size="sm"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        <Edit className="mr-2 h-3 w-3" />
                                        {t('edit')}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </DialogHeader>

                    {selectedPricing && (
                        <div className="space-y-6 py-4">
                            {/* Tarifs de Base */}
                            <div className="space-y-4">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <DollarSign className="h-4 w-4" />
                                    {t('baseFees')}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label>{t('trainingFee')}</Label>
                                        <Input
                                            type="number"
                                            value={selectedPricing.baseCourseFee}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('baseCourseFee', Number(e.target.value))}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{t('examFee')}</Label>
                                        <Input
                                            type="number"
                                            value={selectedPricing.examUnitFee}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('examUnitFee', Number(e.target.value))}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{t('stampFee')}</Label>
                                        <Input
                                            type="number"
                                            value={selectedPricing.stampUnitFee}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('stampUnitFee', Number(e.target.value))}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Règles de facturation */}
                            <div className="space-y-4">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <SettingsIcon className="h-4 w-4" />
                                    {t('billingRules')}
                                </h3>
                                <div className="grid gap-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm">{t('billExamJustified')}</Label>
                                        <Switch
                                            checked={selectedPricing.billExamOnJustifiedAbsence}
                                            onCheckedChange={(checked) => updateField('billExamOnJustifiedAbsence', checked)}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm">{t('billStampJustified')}</Label>
                                        <Switch
                                            checked={selectedPricing.billStampOnJustifiedAbsence}
                                            onCheckedChange={(checked) => updateField('billStampOnJustifiedAbsence', checked)}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm">{t('billExamUnjustified')}</Label>
                                        <Switch
                                            checked={selectedPricing.billExamOnUnjustifiedAbsence}
                                            onCheckedChange={(checked) => updateField('billExamOnUnjustifiedAbsence', checked)}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm">{t('billStampUnjustified')}</Label>
                                        <Switch
                                            checked={selectedPricing.billStampOnUnjustifiedAbsence}
                                            onCheckedChange={(checked) => updateField('billStampOnUnjustifiedAbsence', checked)}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Véhicules */}
                            <div className="space-y-4">
                                <h3 className="font-semibold">{t('vehicleConfig')}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>{t('maxVehicles')}</Label>
                                        <Input
                                            type="number"
                                            value={selectedPricing.maxVehicles}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('maxVehicles', Number(e.target.value))}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{t('candidatesPerVehicle')}</Label>
                                        <Input
                                            type="number"
                                            value={selectedPricing.candidatesPerVehicle}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('candidatesPerVehicle', Number(e.target.value))}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {t('totalCapacity')}: {selectedPricing.maxVehicles * selectedPricing.candidatesPerVehicle}
                                </p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
