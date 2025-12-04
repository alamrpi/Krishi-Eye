"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UnitList } from "@/components/settings/UnitList"
import { CreateUnitDialog } from "@/components/settings/CreateUnitDialog"

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-gray-500">Manage your account settings and preferences.</p>
            </div>
            <Separator />

            <Tabs defaultValue="units" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="units">Measurement Units</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-4">
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Profile Information</h2>
                        <div className="grid gap-4 max-w-xl">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" placeholder="Enter your name" defaultValue="Trader User" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="Enter your email" defaultValue="trader@example.com" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" type="tel" placeholder="Enter your phone number" />
                            </div>
                            <Button className="w-fit">Save Changes</Button>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="units" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold">Measurement Units</h2>
                            <p className="text-sm text-gray-500">Define custom units for your products (e.g., Sacks, Baskets).</p>
                        </div>
                        <CreateUnitDialog />
                    </div>
                    <UnitList />
                </TabsContent>

                <TabsContent value="notifications" className="space-y-4">
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Notifications</h2>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="email-notif" className="rounded border-gray-300" defaultChecked />
                                <Label htmlFor="email-notif">Email Notifications</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sms-notif" className="rounded border-gray-300" />
                                <Label htmlFor="sms-notif">SMS Notifications</Label>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="security" className="space-y-4">
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Security</h2>
                        <div className="grid gap-4 max-w-xl">
                            <div className="grid gap-2">
                                <Label htmlFor="current-password">Current Password</Label>
                                <Input id="current-password" type="password" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <Input id="new-password" type="password" />
                            </div>
                            <Button variant="outline" className="w-fit">Update Password</Button>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
