using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Services.Description;
using Registration.Models;
using Registration.Models.Registration;
using System.Security.Cryptography;
using System.Text;

namespace Registration.Controllers.Registration
{
    public class RegistrationController : Controller
    {
        // GET: Registration
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult SaveRegistration(RegistrationModel model)
        {
            try
            {
                HttpPostedFileBase fb = null;
                for (int i = 0; i < Request.Files.Count; i++)
                {
                    fb = Request.Files[i];
                }

                return Json(new { Message = new RegistrationModel().SaveRegistration(fb, model) },
                    JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { ex.Message, }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult GetList()
        {
            try
            {
                return Json(new { model = new RegistrationModel().GetList() }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { model = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public ActionResult EditReg(int Sr_No)
        {
            try
            {
                return Json(new { model = new RegistrationModel().EditReg(Sr_No) }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json ( new { ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}