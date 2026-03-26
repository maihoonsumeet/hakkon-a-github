
import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, Trash2 } from 'lucide-react';
import type { Club, PageContext, Post, User } from '../../types';
import CommentSection from './CommentSection';

interface PostCardProps {
    post: Post;
    club: Club;
    navigateTo: (page: string, context?: PageContext) => void;
    users: User[];
    onAddComment: (clubId: number, postId: number, commentText: string) => void;
    currentUser: User;
    isDetailView?: boolean;
    onDeletePost?: (clubId: number, postId: number) => void;
    onDeleteComment?: (clubId: number, postId: number, commentId: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, club, navigateTo, users, onAddComment, currentUser, isDetailView = false, onDeletePost, onDeleteComment }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes);

    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsLiked(!isLiked);
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    };

    const handleCardClick = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('button, a, form, input')) return;
        if (!isDetailView) {
            navigateTo('postDetail', { postId: post.id, clubId: club.id });
        }
    };
    
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDeletePost && window.confirm('Are you sure you want to delete this post?')) {
            onDeletePost(club.id, post.id);
        }
    };

    return (
        <div className={`bg-white ${!isDetailView ? 'cursor-pointer' : ''}`} onClick={handleCardClick}>
            <div className="p-6">
                <div className="flex items-center mb-4 group" onClick={(e) => { e.stopPropagation(); navigateTo('clubPublicView', { clubId: club.id }); }}>
                    <img src={club.logo} alt={club.name} className="w-12 h-12 mr-4" />
                    <div>
                        <h3 className="font-bold text-2xl group-hover:underline">{club.name}</h3>
                        <p className="text-sm">{new Date(post.timestamp).toLocaleString()}</p>
                    </div>
                </div>
                <p className="mb-4 text-base">{post.text}</p>
            </div>
            {post.image && <img src={post.image} alt="Post content" className="w-full h-auto" />}
            <div className="p-4 border-t-4">
                <div className="flex justify-between items-center">
                    <div className="flex space-x-5">
                        <button onClick={handleLike} className={`flex items-center space-x-2 bg-transparent border-none p-0 ${isLiked ? 'text-pink-500' : ''}`}>
                            <Heart fill={isLiked ? 'currentColor' : 'none'} size={24} />
                            <span>{likeCount}</span>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); if (!isDetailView) navigateTo('postDetail', { postId: post.id, clubId: club.id }) }} className="flex items-center space-x-2 bg-transparent border-none p-0">
                            <MessageCircle size={24} />
                            <span>{post.comments.length}</span>
                        </button>
                        <button onClick={(e) => e.stopPropagation()} className="flex items-center space-x-2 bg-transparent border-none p-0">
                            <Share2 size={24} />
                        </button>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={(e) => e.stopPropagation()} className="flex items-center space-x-2 bg-transparent border-none p-0">
                            <Bookmark size={24} />
                        </button>
                        {onDeletePost && currentUser.id === club.creatorId && (
                            <button onClick={handleDelete} title="Delete Post" className="bg-red-500 p-1">
                                <Trash2 size={20} />
                            </button>
                        )}
                    </div>
                </div>
                {isDetailView && <CommentSection post={post} club={club} users={users} onAddComment={onAddComment} currentUser={currentUser} onDeleteComment={onDeleteComment} />}
            </div>
        </div>
    );
};

export default PostCard;
