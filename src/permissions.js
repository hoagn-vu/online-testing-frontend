export default function hasPermission(role, permission) {
  return permissions[permission]?.includes(role) || false;
};

const permissions = {
  // users
  get_staff: ["admin", "staff"],
  get_lecturer: ["admin", "staff"],
  get_candidate: ["admin", "staff"],
  get_supervisor: ["admin", "staff"],
  create_user: ["admin"],
  update_user: ["admin"],
  delete_user: ["admin"],
  import_users: ["admin"],
  toggle_status: ["admin", "staff"],
  change_password: ["admin"],
  vo_hieu_hoa_stu: ["staff"],
  // groups

  // organize exams

  // sessions

  // room in sessions

  // candidates in room

  // rooms

  // subjects
  add_subject: ["staff"],
  edit_del_subject: ["staff"],
  del_subject: ["staff"],
  // question banks

  // questions

  // exam matrices

  // exams

  // levels
  add_level: ["staff"],
  edit_del_level: ["staff"],
  // logs

  // monitoring

  // reports

  // statistics

  // take exam

  // results
};
