'use client';

import { useState, useRef, use } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

interface CandidatPhotoUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (photoBase64: string) => void;
  currentPhoto?: string;
}

export default function CandidatPhotoUpload({
  isOpen,
  onClose,
  onUpload,
  currentPhoto,
}: CandidatPhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentPhoto || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations('candidats');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image');
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 5 MB');
      return;
    }

    // Lire et convertir en base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setPreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!preview) return;
    
    setIsUploading(true);
    try {
      await onUpload(preview);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('profilePhoto')}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          {/* Aperçu */}
          <Avatar className="h-40 w-40 border-4 border-background shadow-xl">
            <AvatarImage src={preview || ''} alt="Preview" />
            <AvatarFallback className="text-5xl">
              <Upload className="w-16 h-16 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>

          {/* Input file caché */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />

          {/* Boutons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              {t('uploadPhoto')}
            </Button>
            
            {preview && (
              <Button variant="ghost" onClick={handleRemove}>
                <X className="w-4 h-4 mr-2" />
                {t('delete')}
              </Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground text-center">
            {t('photoText')}
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!preview || isUploading}
          >
            {isUploading ? t('uplaod') : t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
