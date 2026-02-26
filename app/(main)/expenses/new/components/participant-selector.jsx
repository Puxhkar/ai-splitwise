"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useConvexQuery, useConvexMutation } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, UserPlus, Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function ParticipantSelector({ participants, onParticipantsChange }) {
  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [isCreatingGuest, setIsCreatingGuest] = useState(false);
  const createGuestUser = useConvexMutation(api.users.createGuestUser);

  // Search for users
  const { data: searchResults, isLoading } = useConvexQuery(
    api.users.searchUsers,
    { query: searchQuery }
  );

  // Add a participant
  const addParticipant = (user) => {
    // Check if already added
    if (participants.some((p) => p.id === user.id)) {
      return;
    }

    // Add to list
    onParticipantsChange([...participants, user]);
    setOpen(false);
    setSearchQuery("");
  };

  // Create & Add a Guest Participant
  const handleCreateGuest = async (e) => {
    e.preventDefault();
    if (!guestName.trim()) {
      toast.error("Name is required");
      return;
    }

    setIsCreatingGuest(true);
    try {
      const guest = await createGuestUser.mutate({
        name: guestName.trim(),
        email: guestEmail.trim() || undefined,
        phone: guestPhone.trim() || undefined
      });
      addParticipant(guest);
      toast.success(`Participant ${guest.name} added!`);
      // Reset form
      setShowGuestForm(false);
      setGuestName("");
      setGuestEmail("");
      setGuestPhone("");
    } catch (error) {
      toast.error("Failed to add participant");
    } finally {
      setIsCreatingGuest(false);
    }
  };

  // Open the guest form, initialized with the search query
  const openGuestForm = () => {
    setGuestName(searchQuery);
    setShowGuestForm(true);
  };

  // Remove a participant
  const removeParticipant = (userId) => {
    // Don't allow removing yourself
    if (userId === currentUser._id) {
      return;
    }

    onParticipantsChange(participants.filter((p) => p.id !== userId));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {participants.map((participant) => (
          <Badge
            key={participant.id}
            variant="secondary"
            className="flex items-center gap-2 px-3 py-2"
          >
            <Avatar className="h-5 w-5">
              <AvatarImage src={participant.imageUrl} />
              <AvatarFallback>
                {participant.name?.charAt(0) || "?"}
              </AvatarFallback>
            </Avatar>
            <span>
              {participant.id === currentUser?._id
                ? "You"
                : participant.name || participant.email}
            </span>
            {participant.id !== currentUser?._id && (
              <button
                type="button"
                onClick={() => removeParticipant(participant.id)}
                className="ml-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
        ))}

        {participants.length < 2 && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 text-xs"
                type="button"
              >
                <UserPlus className="h-3.5 w-3.5" />
                Add person
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
              {showGuestForm ? (
                <div className="p-4" onClick={(e) => e.stopPropagation()}>
                  <h4 className="font-semibold text-sm mb-3">Add Custom Participant</h4>
                  <div className="space-y-3">
                    <div>
                      <Input
                        placeholder="Full Name *"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="h-8"
                        autoFocus
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-zinc-400" />
                      <Input
                        placeholder="Email (optional)"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        className="h-8"
                        type="email"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-zinc-400" />
                      <Input
                        placeholder="Phone (optional)"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        className="h-8"
                        type="tel"
                      />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setShowGuestForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        className="flex-1"
                        disabled={!guestName.trim() || isCreatingGuest}
                        onClick={handleCreateGuest}
                      >
                        {isCreatingGuest ? "Adding..." : "Add Person"}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <Command>
                  <CommandInput
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />
                  <CommandList>
                    <CommandEmpty>
                      {isLoading ? (
                        <p className="py-3 px-4 text-sm text-center text-muted-foreground">
                          Loading...
                        </p>
                      ) : (
                        <p className="py-6 px-4 text-sm text-center text-muted-foreground">
                          No users found matching "{searchQuery}"
                        </p>
                      )}
                    </CommandEmpty>
                    <CommandGroup heading={searchQuery.length < 2 ? "Available Users" : "Search Results"}>
                      {searchResults?.map((user) => (
                        <CommandItem
                          key={user.id}
                          value={user.name + user.email}
                          onSelect={() => addParticipant(user)}
                        >
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={user.imageUrl} />
                              <AvatarFallback>
                                {user.name?.charAt(0) || "?"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="text-sm">{user.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {user.email}
                              </span>
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>

                  {/* Sticky Custom User Button */}
                  <div className="p-2 border-t border-zinc-100 bg-zinc-50/50">
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full justify-start text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      onClick={() => openGuestForm()}
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add a custom member manually
                    </Button>
                  </div>
                </Command>
              )}
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}
