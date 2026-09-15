import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";

type Props = {
    value?: Date;
    onChange?: (date: Date | undefined) => void;
    disabled?: boolean;
};

export const DatePicker = ({ value, onChange, disabled }: Props) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    disabled={disabled}
                    variant="outline"
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !value && "text-muted-foreground",
                    )}
                >
                    <CalendarIcon className="mr-2 size-4" />
                    {value ? format(value, "PPP") : <span>Pick A Date</span>}
                </Button>
            </PopoverTrigger>

            <PopoverContent>
                <Calendar
                    mode="single"
                    selected={value}
                    onSelect={onChange}
                    disabled={disabled}
                />
            </PopoverContent>
        </Popover>
    );
};
