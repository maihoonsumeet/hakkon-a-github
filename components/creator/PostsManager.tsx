
import React, { useState, useRef } from 'react';
import { Camera, Trash2 } from 'lucide-react';
import type { Club } from '../../types';

interface PostsManagerProps {
    club: Club;
    onAddPost: (clubId: number, newPost: { text: string, image: string | null }) => void;
    onDeletePost: (clubId: number, postId: number) => void;
}

const PostsManager: React.FC<PostsManagerProps> = ({ club, onAddPost, onDeletePost }) => {
    const [postText, setPostText] = useState('');
    const [postImage, setPostImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!postText) return;
        onAddPost(club.id, { text: postText, image: postImage });
        setPostText('');
        setPostImage(null);
    };

    const handleImageButtonClick = () => fileInputRef.current?.click();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => setPostImage(event.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleDelete = (postId: number) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            onDeletePost(club.id, postId);
        }
    }

    return (
        <div className="bg-white p-8 space-y-6">
            <h3 className="text-4xl">Manage Posts</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea value={postText} onChange={e => setPostText(e.target.value)} rows={4} placeholder="What's new with the team?"></textarea>
                {postImage && <div className="relative"><img src={postImage} alt="preview" /><button type="button" onClick={() => setPostImage(null)} className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 leading-none">&times;</button></div>}
                <div className="flex justify-between items-center">
                    <button type="button" onClick={handleImageButtonClick} className="flex items-center space-x-2 text-blue-500 bg-transparent border-none p-0">
                        <Camera size={20} />
                        <span>Add Image</span>
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    <button type="submit" className="px-6 py-2">Post Update</button>
                </div>
            </form>
            <div className="space-y-4">
                <h4 className="font-bold text-2xl">Recent Posts</h4>
                {club.posts.map(post => (
                    <div key={post.id} className="p-4 bg-gray-50 flex justify-between items-center">
                        <p className="flex-1 pr-4">{post.text.length > 100 ? `${post.text.substring(0, 100)}...` : post.text}</p>
                        <button onClick={() => handleDelete(post.id)} title="Delete Post" className="bg-red-500 p-2">
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PostsManager;
