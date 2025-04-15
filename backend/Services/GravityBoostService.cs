using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudyVerseBackend.Entities;
using StudyVerseBackend.Infastructure.Contexts;
using StudyVerseBackend.Models.GalaxyBoost;
using StudyVerseBackend.Services;

namespace StudyVerseBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GravityBoostController : ControllerBase
    {
        private readonly GravityBoostService _gravityBoostService;

        public GravityBoostController(GravityBoostService gravityBoostService)
        {
            _gravityBoostService = gravityBoostService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateBoost([FromBody] GalaxyBoostPostDto boost)
        {

            var userId = GetUserIdFromToken();

            if (userId == null) return Unauthorized("Invalid JWT token");


            var createdBoost = await _gravityBoostService.SendBoost(userId, boost);
            return CreatedAtAction(nameof(GetBoostById), new { id = createdBoost.Boost_Id }, createdBoost);
        }

        [HttpGet]
        /*
         * Returns all the boosts that a user has recieved.
         */
        public async Task<IActionResult> GetAllBoosts()
        {

            var userId = GetUserIdFromToken();

            if (userId == null) return Unauthorized("Invalid JWT token");


            var boosts = await _gravityBoostService.GetAllBoosts(userId);
            return Ok(boosts);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBoostById(int id)
        {
            var boost = await _gravityBoostService.GetBoostById(id);
            if (boost == null) return NotFound();
            return Ok(boost);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBoost(int id, [FromBody] GravityBoosts boost)
        {
            var updatedBoost = await _gravityBoostService.UpdateBoost(id, boost);
            if (updatedBoost == null) return NotFound();
            return Ok(updatedBoost);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBoost(int id)
        {
            var deleted = await _gravityBoostService.DeleteBoost(id);
            if (!deleted) return NotFound();
            return Ok(new { message = "Gravity Boost deleted successfully" });
        }

        private string? GetUserIdFromToken()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier);
        }
    }
}
