using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using Registration.Data;
using System.Data.Entity;
using static BCrypt.Net.BCrypt;

namespace Registration.Models.Registration
{
    public class RegistrationModel
    {
        public int Sr_No { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string Email_Id { get; set; }
        public string DOB { get; set; }
        public string Photo { get; set; }
        public string Mobile_No { get; set; }
        public string Pincode { get; set; }
        public string Password { get; set; }

        public string SaveRegistration(HttpPostedFileBase fb, RegistrationModel model)
        {
            string msg = "";
            Registration_FormEntities db = new Registration_FormEntities();
            string filepath = "";
            string fileName = "";
            string sysFileName = "";
           
            if (fb != null && fb.ContentLength > 0)
            {
                filepath = HttpContext.Current.Server.MapPath("~/Content/Images/");
                DirectoryInfo di = new DirectoryInfo(filepath);
                if (!di.Exists)
                {
                    di.Create();
                }
                fileName = fb.FileName;
                sysFileName = DateTime.Now.ToFileTime().ToString() + Path.GetExtension(fb.FileName);
                fb.SaveAs(filepath + "//" + sysFileName);
            }



            if (model.Sr_No == 0)
            {
                var SaveRegistration = new Registration_Form()
                {
                    Sr_No = model.Sr_No,
                    Name = model.Name,
                    Address = model.Address,
                    Email_Id = model.Email_Id,
                    DOB = model.DOB,
                    Photo = sysFileName,
                    Mobile_No = model.Mobile_No,
                    Pincode = model.Pincode,
                    Password = BCrypt.Net.BCrypt.HashPassword(model.Password),
                };
                db.Registration_Form.Add(SaveRegistration);
                msg = "Data Saved Successfully";
            }
            else
            {
                var RegData = db.Registration_Form.Where(p => p.Sr_No == model.Sr_No).FirstOrDefault();
                if ( RegData != null )
                {
                    RegData.Sr_No = model.Sr_No;
                    RegData.Name = model.Name;
                    RegData.Address = model.Address;
                    RegData.Email_Id = model.Email_Id;
                    RegData.DOB = model.DOB;
                    if (!string.IsNullOrEmpty(sysFileName))
                    {
                        RegData.Photo = sysFileName;
                        db.Entry(RegData).State = EntityState.Modified;
                    }
                    RegData.Mobile_No = model.Mobile_No;
                    RegData.Pincode = model.Pincode;
                    RegData.Password = BCrypt.Net.BCrypt.HashPassword(model.Password);

                    msg = "Data Updated Successfully..";
                }
                else
                {
                    msg = "Record Not Found.";
                }
            }
            db.SaveChanges();
            return msg;
        }

        public List<RegistrationModel> GetList()
        {
            Registration_FormEntities Db = new Registration_FormEntities();
            List<RegistrationModel> Reg = new List<RegistrationModel>();
            var RegistrationModel = Db.Registration_Form.ToList();
            if(RegistrationModel != null)
            {
                foreach (var item in RegistrationModel)
                {
                    Reg.Add(new RegistrationModel()
                    {
                        Sr_No = item.Sr_No,
                        Name = item.Name,
                        Address = item.Address,
                        Email_Id = item.Email_Id,
                        DOB = item.DOB,
                        Photo = item.Photo,
                        Mobile_No = item.Mobile_No,
                        Pincode = item.Pincode,
                        Password = item.Password,
                    });
                }
            }
            return Reg;
        }

        public RegistrationModel EditReg(int Sr_No)
        {
            RegistrationModel model = new RegistrationModel();
            Registration_FormEntities Db = new Registration_FormEntities();
            var RegData = Db.Registration_Form.Where( p => p.Sr_No == Sr_No).FirstOrDefault();
            if( RegData != null )
            {
                model.Sr_No = RegData.Sr_No;
                model.Name = RegData.Name;
                model.Address = RegData.Address;
                model.Email_Id = RegData.Email_Id;
                model.DOB = RegData.DOB;
                model.Photo = RegData.Photo;
                model.Mobile_No = RegData.Mobile_No;
                model.Pincode = RegData.Pincode;
                model.Password = RegData.Password;
            };
            return model;
        }
    }
}