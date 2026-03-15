import { UserForm, type UserFormValues } from "@/components/forms/users/user-form";
import { type UserItem } from "@/lib/api/features/users";
import { extractRoleName } from "@/lib/users/helpers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type UserCreateEditCardProps = {
    editingUser: UserItem | null;
    onCreate: (values: UserFormValues) => void;
    onUpdate: (values: UserFormValues) => void;
    onCancelEdit: () => void;
    isCreateSubmitting: boolean;
    isUpdateSubmitting: boolean;
};

export function UserCreateEditCard({
    editingUser,
    onCreate,
    onUpdate,
    onCancelEdit,
    isCreateSubmitting,
    isUpdateSubmitting,
}: UserCreateEditCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{editingUser ? "Edit User" : "Create User"}</CardTitle>
                <CardDescription>
                    {editingUser ? "Update selected user details." : "Create a new user in your scope."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {editingUser ? (
                    <UserForm
                        mode="edit"
                        initialValues={{
                            firstName: editingUser.firstName,
                            lastName: editingUser.lastName,
                            email: editingUser.email,
                            role: extractRoleName(editingUser.role) as UserFormValues["role"],
                            managerId: editingUser.managerId ?? "",
                        }}
                        onSubmit={onUpdate}
                        onCancel={onCancelEdit}
                        isSubmitting={isUpdateSubmitting}
                    />
                ) : (
                    <UserForm
                        mode="create"
                        onSubmit={onCreate}
                        isSubmitting={isCreateSubmitting}
                    />
                )}
            </CardContent>
        </Card>
    );
}