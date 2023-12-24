use std::mem;


pub fn cast_to_parts<T>(content: &T) -> &[u8] {
  let ptr = content as *const T as *const u8;
  let len = mem::size_of::<T>();
  unsafe { std::slice::from_raw_parts(ptr, len) }
}

pub fn cast_to<T>(value: &[u8]) -> &T {
  let ptr = value.as_ptr() as *const T;
  unsafe { &*ptr }
}

pub fn cast_mut_to<T>(value: &mut [u8]) -> &mut T {
  let ptr = value.as_mut_ptr() as *mut T;
  unsafe { &mut *ptr }
}
