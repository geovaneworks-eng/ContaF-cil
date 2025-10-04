import React, { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { UserIcon, PencilIcon } from '@/components/icons';

interface AvatarProps {
    size: number;
}

const Avatar: React.FC<AvatarProps> = ({ size }) => {
    const { user, updateUser } = useAuth();
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('Selecione uma imagem para fazer o upload.');
            }

            if (!user) return;

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true });

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
            
            // Adiciona um timestamp para evitar problemas de cache do navegador
            const imageUrl = data.publicUrl + `?t=${new Date().getTime()}`;

            await updateUser({ avatarUrl: imageUrl });

        } catch (error: any) {
            alert(`Erro: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="relative" style={{ width: size, height: size }}>
            {user?.avatarUrl ? (
                <img
                    src={user.avatarUrl}
                    alt="Avatar"
                    className="rounded-full object-cover"
                    style={{ width: size, height: size }}
                />
            ) : (
                <div className="bg-gray-200 rounded-full flex items-center justify-center text-gray-500" style={{ width: size, height: size }}>
                    <UserIcon />
                </div>
            )}
            <button
                onClick={triggerFileInput}
                className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors"
                disabled={uploading}
                aria-label="Mudar foto de perfil"
            >
                <PencilIcon />
            </button>
            <input
                ref={fileInputRef}
                type="file"
                id="single"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
                className="hidden"
            />
        </div>
    );
};

export default Avatar;