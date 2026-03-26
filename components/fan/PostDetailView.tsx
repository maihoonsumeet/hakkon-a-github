
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import PostCard from '../shared/PostCard';
import type { Club, Post, User } from '../../types';

interface PostDetailViewProps {
    post: Post;
    club: Club;
    navigateBack: () => void;
    users: User[];
    onAddComment: (clubId: number, postId: number, commentText: string) => void;
    currentUser: User;
    onDeletePost: (clubId: number, postId: number) => void;
    onDeleteComment: (clubId: number, postId: number, commentId: number) => void;
}

const PostDetailView: React.FC<PostDetailViewProps> = ({ post, club, navigateBack, users, onAddComment, currentUser, onDeletePost, onDeleteComment }) => {
    if (!post || !club) {
        return (
            <div className="text-center bg-white p-8">
                <p>KABOOM! Post not found.</p>
                <button onClick={navigateBack} className="text-blue-500 mt-4">Go Back</button>
            </div>
        );
    }
    return (
        <div className="max-w-3xl mx-auto">
            <button onClick={navigateBack} className="flex items-center space-x-2 text-blue-500 mb-4 bg-transparent border-none p-0">
                <ArrowLeft size={20} />
                <span>Back</span>
            </button>
            <PostCard post={post} club={club} navigateTo={() => {}} users={users} onAddComment={onAddComment} currentUser={currentUser} isDetailView={true} onDeletePost={onDeletePost} onDeleteComment={onDeleteComment} />
        </div>
    );
};

export default PostDetailView;
