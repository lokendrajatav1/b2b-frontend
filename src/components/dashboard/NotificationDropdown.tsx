'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2, Clock, ShieldCheck, Mail, Info } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Notification {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export default function NotificationDropdown() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await apiFetch('/notifications');
            setNotifications(res.data || []);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async (id: string) => {
        try {
            await apiFetch(`/notifications/${id}/read`, { method: 'PATCH' });
            setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const markAllRead = async () => {
        try {
            await apiFetch('/notifications/read-all', { method: 'PATCH' });
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2.5 rounded-lg transition-colors relative group ${isOpen ? 'bg-[#007367]/5 text-[#007367]' : 'text-slate-700 hover:bg-gray-200/50'}`}
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-4 w-96 bg-white rounded-2xl border border-gray-100 shadow-xl z-50 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-semibold text-slate-900">Notifications</h3>
                                <div className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md text-base font-semibold leading-none">
                                    {unreadCount} new
                                </div>
                            </div>
                            {unreadCount > 0 && (
                                <button 
                                    onClick={markAllRead}
                                    className="text-base font-medium text-[#007367] hover:text-blue-700 transition-colors"
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>

                        {/* List */}
                        <div className="max-h-[400px] overflow-y-auto">
                            {loading && notifications.length === 0 ? (
                                [1, 2, 3].map(i => (
                                    <div key={i} className="p-4 border-b border-gray-50 animate-pulse flex gap-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded-xl"></div>
                                        <div className="flex-1 space-y-2 py-1">
                                            <div className="h-3 bg-gray-100 rounded-full w-24"></div>
                                            <div className="h-3 bg-gray-100 rounded-full w-full"></div>
                                        </div>
                                    </div>
                                ))
                            ) : notifications.length > 0 ? (
                                notifications.map((n) => (
                                    <div 
                                        key={n.id} 
                                        onClick={() => !n.isRead && markAsRead(n.id)}
                                        className={`p-4 border-b border-gray-50 flex gap-3 transition-colors cursor-pointer group ${!n.isRead ? 'bg-[#007367]/5/30' : 'hover:bg-gray-50'}`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${!n.isRead ? 'bg-white border-[#007367]/10' : 'bg-gray-50 border-gray-100'}`}>
                                            <Info className={`w-5 h-5 ${!n.isRead ? 'text-[#007367]' : 'text-slate-500'}`} />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-base font-semibold text-slate-900">{n.title}</h4>
                                                <div className="flex items-center gap-1.5 text-slate-500">
                                                    <Clock className="w-3 h-3" />
                                                    <span className="text-base font-medium">{new Date(n.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <p className="text-base text-slate-700 font-medium leading-relaxed">{n.message}</p>
                                        </div>
                                        {!n.isRead && (
                                            <div className="w-2 h-2 bg-[#007367] rounded-full mt-1.5 shrink-0"></div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center text-slate-500 space-y-3">
                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto border border-gray-100">
                                        <Bell className="w-6 h-6 text-gray-300" />
                                    </div>
                                    <p className="text-base font-medium">You're all caught up!</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-3 bg-gray-50/50 text-center border-t border-gray-100/50">
                            <Link 
                                href={
                                    user?.role === 'SUPERADMIN' ? '/super-admin/notifications' : 
                                    user?.role === 'ADMIN' ? '/admin/notifications' : 
                                    '/vendor/notifications'
                                }
                                onClick={() => setIsOpen(false)}
                                className="text-base font-semibold text-slate-500 hover:text-[#007367] transition-colors uppercase  flex items-center justify-center gap-2"
                            >
                                View all notification vault
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
