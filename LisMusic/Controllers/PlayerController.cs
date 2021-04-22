using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LisMusic.Controllers
{
    public class PlayerController : Controller
    {
        public IActionResult Index() => View();
    }
}
