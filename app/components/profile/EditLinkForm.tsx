import { Form, useLoaderData, useNavigate } from "react-router";
import { DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { getInputProps, getFormProps, useForm, getTextareaProps } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Upload } from "lucide-react";
import { getIconComponent, iconOptions } from "~/utils/icons";
import type { loader } from "~/routes/profile/$id";
import { useEffect, useState } from "react";
import { UpdateLinkSchema } from "~/dtos/link/updateLink.dto";

export function EditLinkForm() {
  const { link } = useLoaderData<typeof loader>();
  const [selectedIcon, setSelectedIcon] = useState(link?.icon || "website");
  
  const [form, fields] = useForm({
    id: "edit-link-form",
    defaultValue: {
      title: link?.title,
      link: link?.link,
      description: link?.description || "",
      icon: link?.icon || "website"
    },
    onValidate: ({ formData }) => {
      return parseWithZod(formData, { schema: UpdateLinkSchema })
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const [preview, setPreview] = useState({
    title: link?.title,
    description: link?.description || "",
    icon: link?.icon || "website"
  });

  useEffect(() => {
    const formElement = document.getElementById(form.id) as HTMLFormElement;
    if (formElement) {
      const formData = new FormData(formElement);
      setPreview({
        title: formData.get("title") as string || link?.title,
        description: formData.get("description") as string || link?.description || "",
        icon: selectedIcon
      });
    }
  }, [form.id, link, selectedIcon]);

  const handleIconChange = (value: string) => {
    setSelectedIcon(value);
    setPreview(prev => ({ ...prev, icon: value }));
  };

  return (
    <DialogContent className="sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle className="text-2xl">Edit Link</DialogTitle>
        <DialogDescription className="text-base">Update your link details</DialogDescription>
      </DialogHeader>
      <Form method="post" {...getFormProps(form)}>
        <input type="hidden" name="linkId" value={link?.id} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <Label htmlFor="title" className="text-base font-medium">
                Link Title *
              </Label>
              <Input
                {...getInputProps(fields.title, { type: "text" })}
                placeholder="Enter link title"
                className="mt-2 h-12"
              />
              <div className="text-red-500 text-sm" id={fields.title.errorId}>
                {fields.title.errors}
              </div>
            </div>

            <div>
              <Label htmlFor="link" className="text-base font-medium">
                Destination URL *
              </Label>
              <Input
                {...getInputProps(fields.link, { type: "text" })}
                placeholder="https://example.com"
                className="mt-2 h-12"
              />
              <div className="text-red-500 text-sm" id={fields.link.errorId}>
                {fields.link.errors}
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-base font-medium">
                Description (Optional)
              </Label>
              <Textarea
                {...getTextareaProps(fields.description)}
                placeholder="Brief description of this link"
                className="mt-2 min-h-[80px]"
              />
              <div className="text-red-500 text-sm" id={fields.description.errorId}>
                {fields.description.errors}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="icon" className="text-base font-medium">
                Choose Icon
              </Label>
              <input 
                type="hidden" 
                name="icon" 
                value={selectedIcon}
              />
              <div className="mt-2">
              <Select
                value={selectedIcon}
                onValueChange={handleIconChange}
                
              >
                <SelectTrigger className="mt-2 h-12 w-full flex">
                  <SelectValue className="w-full">
                    {(() => {
                      const option = iconOptions.find(opt => opt.value === selectedIcon);
                      if (option) {
                        const IconComponent = option.icon;
                        return (
                          <div className="flex items-center space-x-3">
                            <IconComponent className={`w-5 h-5 ${option.color}`} />
                            <span>{option.label}</span>
                          </div>
                        );
                      }
                      return "Select an icon";
                    })()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {iconOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center space-x-3">
                          <IconComponent className={`w-5 h-5 ${option.color}`} />
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
                        </div>
              <div className="text-red-500 text-sm" id={fields.icon.errorId}>
                {fields.icon.errors}
              </div>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">Or upload custom icon</p>
              <Button type="button" variant="outline" size="sm">
                Choose File
              </Button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-3">Preview</p>
              <div className="bg-white rounded-lg p-4 border">
                <div className="flex items-center space-x-3">
                  {(() => {
                    const { icon: IconComponent, color } = getIconComponent(preview.icon);
                    return <IconComponent className={`w-6 h-6 ${color}`} />;
                  })()}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{preview.title || "Link Title"}</p>
                    {preview.description && (
                      <p className="text-sm text-gray-500 truncate">{preview.description}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 mt-6 border-t">
          <DialogClose asChild>
            <Button type="button" variant="outline" size="lg">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" size="lg">
            Update Link
          </Button>
        </div>
      </Form>
    </DialogContent>
  );
}