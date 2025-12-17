import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ChevronDownIcon } from 'lucide-react';
import React from 'react';

const Dashboard = () => {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  function handleSubmit() {
    console.log('hej');
  }
  return (
    <>
      <Dialog>
        <form onSubmit={handleSubmit}>
          <DialogTrigger asChild>
            <button>+ Add transaction</button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-106'>
            <DialogHeader>
              <DialogTitle>Add transaction</DialogTitle>
              <DialogDescription>
                Add your transaction here. Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-4'>
              <div className='grid gap-3'>
                <label htmlFor='type'>Type</label>
                <Select>
                  <SelectTrigger className='cursor-pointer'>
                    <SelectValue placeholder='Select a type' />
                  </SelectTrigger>
                  <SelectContent position='popper' align='start'>
                    <SelectGroup>
                      <SelectLabel>Select a typpe</SelectLabel>

                      <SelectItem value='banana'>Income</SelectItem>
                      <SelectItem value='blueberry'>Expense</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className='grid gap-3'>
                <label htmlFor='amount'>Amount</label>
                <input id='amount' name='amount' type='number' />
              </div>
              <div className='grid gap-3'>
                <label htmlFor='category'>Category</label>
                <Select>
                  <SelectTrigger className='cursor-pointer'>
                    <SelectValue placeholder='Select a category' />
                  </SelectTrigger>
                  <SelectContent position='popper' align='start'>
                    <SelectGroup>
                      <SelectLabel>Select a category</SelectLabel>
                      <SelectItem value='apple' className='cursor-pointer'>
                        Apple
                      </SelectItem>
                      <SelectItem value='banana'>Banana</SelectItem>
                      <SelectItem value='blueberry'>Blueberry</SelectItem>
                      <SelectItem value='grapes'>Grapes</SelectItem>
                      <SelectItem value='pineapple'>Pineapple</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className='flex flex-col gap-3'>
                <label htmlFor='date' className='px-1'>
                  Date of transaction
                </label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      id='date'
                      className='w-48 justify-between font-normal'
                    >
                      {date ? date.toLocaleDateString() : 'Select date'}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className='w-auto overflow-hidden p-0'
                    align='start'
                  >
                    <Calendar
                      mode='single'
                      selected={date}
                      captionLayout='dropdown'
                      onSelect={(date) => {
                        setDate(date);
                        setOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <button>Cancel</button>
              </DialogClose>
              <button type='submit' onClick={handleSubmit}>Save</button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
};

export default Dashboard;
