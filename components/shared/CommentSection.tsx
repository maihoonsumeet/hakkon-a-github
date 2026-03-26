
import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import type { Club, Post, User } from '../../types';

interface CommentSectionProps {
    post: Post;
    club: Club;
    users: User[];
    onAddComment: (clubId: number, postId: number, commentText: string) => void;
    currentUser: User;
    onDeleteComment?: (clubId: number, postId: number, commentId: number) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ post, club, users, onAddComment, currentUser, onDeleteComment }) => {
    const [commentText, setCommentText] = useState('');
    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentText.trim()) {
            onAddComment(club.id, post.id, commentText);
            setCommentText('');
        }
    };

    return (
        <div className="mt-6 space-y-4">
            <h3 className="text-3xl border-t-4 pt-4">Replies</h3>
            {post.comments.map(comment => {
                const commenter = users.find(u => u.id === comment.userId);
                const canDelete = currentUser.id === comment.userId || currentUser.id === club.creatorId;
                return (
                    <div key={comment.id} className="flex items-start space-x-3 group">
                        <img src={commenter?.avatar} alt={commenter?.name} className="w-10 h-10" />
                        <div className="bg-gray-100 p-3 flex-1 border-2 flex justify-between items-start">
                           <div>
                             <span className="font-bold">{commenter?.name || 'User'}</span>: {comment.text}
                           </div>
                           {onDeleteComment && canDelete && (
                                <button
                                    onClick={() => {
                                        if (window.confirm('Are you sure you want to delete this comment?')) {
                                            onDeleteComment(club.id, post.id, comment.id);
                                        }
                                    }}
                                    title="Delete Comment"
                                    className="bg-red-500 p-1 ml-2 opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={14} />
                                </button>
                           )}
                        </div>
                    </div>
                )
            })}
            <form onSubmit={handleCommentSubmit} className="flex items-center space-x-2 pt-2">
                <img src={currentUser.avatar} alt="your avatar" className="w-10 h-10" />
                <input type="text" value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="WRITE A REPLY..." className="w-full p-2 text-sm" />
                <button type="submit" className="p-2">SEND</button>
            </form>
        </div>
    );
};

export default CommentSection;
